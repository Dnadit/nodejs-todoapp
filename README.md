# Node.js로 todoapp 만들기
- Node.js + express.js + mongoDB + ejs 로 만든 todoApp 입니다
- [todoapp보기](https://todoapp-387307.du.r.appspot.com/) (Google Cloud를 이용한 서버리스 배포)
- 위 링크는 서버리스로 배포하여 모든 기능을 작동시켜보진 못합니다.
- 코딩애플의 강의를 바탕으로 하였습니다.

## 로컬에서 작동방법
- Nodejs 설치를 요구합니다.

```bash
$ npm install
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

## LICENSE
MIT License

Copyright (c) 2023 Dnadit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
