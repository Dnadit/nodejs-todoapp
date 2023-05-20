var router = require('express').Router();

function isLogined(req, res, next) {
    if (req.user) {  // 로그인 후 세션이 있으면 req.user 가 있음.
        next()
    } else {
        res.send('로그인 안하셨어요')
    }
}

// /shirts에만 적용
router.use('/shirts', isLogined); 

router.get('/shirts', (req, res) => {
    res.send('셔츠 파는 페이지입니다.')
});

router.get('/pants', (req, res) => {
    res.send('바지 파는 페이지입니다.')
});

module.exports = router;