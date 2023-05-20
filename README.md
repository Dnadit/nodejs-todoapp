# Node.js로 todoapp 만들기
- 코딩애플의 강의를 바탕으로 만든 todoapp 입니다
- [todoapp보기](https://todoapp-387307.du.r.appspot.com/) (Google Cloud를 이용한 서버리스 배포)
- 위 링크는 서버리스로 배포하여 모든 기능을 작동시켜보진 못합니다.

## 로컬에서 작동방법
- Nodejs 설치를 요구합니다.

```bash
$ npm init
$ npm install
$ npm update
$ node server.js
```
- DB는 MongoDB 다운로드 하여 `URL` 연결

```javaScript
MongoClient.connect(<DB_URL>, (err, client) => {
    if (err) return console.log(err);
    db = client.db('todoapp');

    app.listen(<PORT>, () => {
        console.log('listening on 8080')
    });
});
```
- localhost:`PORT` 로 접속


## 개발환경
- Nodejs 18.16.0
- MongoDB
- Visual Studio Code


