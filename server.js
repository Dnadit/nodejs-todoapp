const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
require('dotenv').config();

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

var db;
MongoClient.connect(process.env.DB_URL, (err, client) => {
    if (err) return console.log(err);
    db = client.db('todoapp');

    app.listen(process.env.PORT, () => {
        console.log('listening on 8080')
    });
});

app.get('/', function (req, res) {
    res.render('index.ejs');
});

app.get('/write', function (req, res) {
    // res.sendFile(__dirname + '/write.html');
    res.render('write.ejs');
});

// get요청 list 보여주기
app.get('/list', (req, res) => {
    // db저장된 post라는 collection안의 모든 데이터 꺼내기
    db.collection('post').find().toArray((err, result) => {
        res.render('list.ejs', { posts: result });
    });
});

app.get('/search', (req, res) => {
    var searchCondition = [
        {
            $search: {
                index: 'titleSearch',
                text: {
                    query: req.query.value,
                    path: 'title'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
                }
            }
        },
        // { $project : { title: 13, _id: 0, score: { $meta: "searchScore" } } }
        // { $sort : { _id : 1 }},
        // { $limit : 10 }
    ]
    db.collection('post').aggregate(searchCondition).toArray((err, result) => {
        console.log(result);
        res.render('search.ejs', { posts: result, search: req.query.value });
    });
});

// /detail
app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({ _id: parseInt(req.params.id) }, (err, result) => {
        console.log(result);
        if (result == null) return res.status(404).send({ message: '없는 페이지입니다.' })
        res.render('detail.ejs', { data: result });
    });
});

app.get('/edit/:id', (req, res) => {

    db.collection('post').findOne({ _id: parseInt(req.params.id) }, (err, result) => {
        console.log(result);
        if (result == null) return res.status(404).send({ message: '없는 post 입니다.' });
        res.render('edit.ejs', { post: result });
    });
});

app.put('/edit', (req, res) => {
    // 폼에 담긴 제목데이터, 날짜데이터를 찾아서
    // db.collection 에다가 업데이트함
    db.collection('post').updateOne({ _id: parseInt(req.body.id) }, { $set: { title: req.body.title, date: req.body.date } }, (err, result) => {
        console.log('수정완료');
        res.redirect('/list')
    });
});

// 로그인 인증 Setting
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// 미들웨어(app.use)
app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/join', function (req, res) {
    res.render('join.ejs');
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/fail'
}), function (req, res) {
    // 아이디 비번 맞으면 로그인 성공페이지로 보내줘야 함
    db.collection('login').findOne({ username: req.body.id }, () => {
        res.redirect('/list');
    });
});

app.get('/mypage', isLogined, function (req, res) {
    console.log(req.user);
    res.render('mypage.ejs', { 사용자: req.user });
});

// 미들웨어
function isLogined(req, res, next) {
    if (req.user) {  // 로그인 후 세션이 있으면 req.user 가 있음.
        next()
    } else {
        res.send('로그인 안하셨어요')
    }
}

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: true, // 로그인 후 세션에 저장?
    passReqToCallback: false, // 아이디, 비번 말고도 다른 정보 검증하고 싶다?
}, function (inputId, inputPassword, done) {
    console.log(inputId, inputPassword);
    db.collection('login').findOne({ username: inputId }, function (err, result) {
        if (err) return done(err)

        if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
        if (inputPassword == result.password) {
            return done(null, result)
        } else {
            return done(null, false, { message: '비번틀렸어요' })
        }
    })
}));

// id를 이용해서 session에 저장(로그인 성공 시 실행)
passport.serializeUser(function (user, done) {
    console.log("로그인 성공");
    done(null, user.username);
});

// 마이페이지 접속 시 실행
passport.deserializeUser(function (id, done) {
    // db에서 위에있는 user.username으로 유저를 찾은 뒤에 유저 정보를 {}에 넣음
    db.collection('login').findOne({ username: id }, function (err, result) {
        done(null, result);
    });
});

app.post('/join', function (req, res) {
    // 중복체크
    db.collection('login').findOne({ username : req.body.username }, (err, result) => {
        if (result.username == req.body.username) return res.send('이미 있는 아이디입니다.');
    });

    // db 저장
    db.collection('login').insertOne({
        username: req.body.username,
        password: req.body.password
    }, (err, result) => {
        console.log('회원가입 저장 완료');
        res.redirect('/')
    });
})

// post요청
// request를 꺼내서 쓸려면 npm install body-parser(request data 해석)
app.post('/add', (req, res) => {    

    db.collection('counter').findOne({ name: 'postsCnt' }, (err, result) => {
        console.log(result.totalPost);
        var totalPost = result.totalPost;

        var data = { _id: totalPost + 1, writer : req.user._id, title: req.body.title, date: req.body.date }

        db.collection('post').insertOne(data, (err, result) => {
            console.log('저장완료');
            db.collection('counter').updateOne({ name: 'postsCnt' }, { $inc: { totalPost: 1 } }, (err, result) => {
                if (err) return console.log(err);
            });
            res.redirect('/list');
        });

    });

});

app.delete('/delete', (req, res) => {
    console.log(req.body);
    req.body._id = parseInt(req.body._id);

    var data = { _id : req.body._id, writer : req.user._id }

    db.collection('post').deleteOne(data, (err, result) => {
        console.log('삭제완료');
        if (err) console.log(err);
        res.status(200).send({ message: '성공했습니다' });
    });
});

// app.use -> 전역 미들웨어
app.use('/shop', require('./routes/shop'));

app.use('/board/sub', require('./routes/board'));