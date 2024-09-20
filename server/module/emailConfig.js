const nodemailer = require('nodemailer');

require('dotenv').config({ path: '.env.gmail' })

const { HOST_SERVICE, GMAIL_EMAIL, GMAIL_PASSWORD } = process.env;

/**
 * 이메일 전송 시 사용하는 법.
 *     const transporter = new EmailTransporter(receiver -> 받는 이메일, authNum -> 인증번호);
 *
 *     transporter.sendMail()
 */
class EmailTransporter {

    constructor(receiver, authNum) {
        // transporter를 전역속성으로 설정함.
        if (HOST_SERVICE === 'gmail' && !this._transporter) {
            this._transporter = nodemailer.createTransport({
                service: HOST_SERVICE,
                auth: {
                    user: GMAIL_EMAIL,
                    pass: GMAIL_PASSWORD
                }
            })
        }

        this._receiver = receiver;
        this._authNum = authNum;
        // contents getter를 이용해서 값을 생성 후 사용하게 함.
        this._contents = this.contents;
    }

    get contents() {
        if (!this._contents) {
            this._contents = this._createContents();
        }

        return this._contents;
    }


    _createContents = () => {
        return {
            from: GMAIL_EMAIL,
            to: this._receiver,
            subject: 'CookNetwork 메일 인증 번호입니다.',
            // text: 'test', 메일 본문에 일반 문자열을 넣는다.
            // html: 메일 본문에 html을 넣는다.
            html: ` <div> 
                    고객 이메일 : ${this._receiver}
                    <br />
                    <p> 
                        이메일 인증 번호 입니다.
                        <br />
                        <br />
                        - 인증 번호: ${this._authNum}
                        <br />
                    </p>
                </div>`
        }
    }

    sendMail = () => {
        return new Promise((resolve, reject) => {
            this._transporter.sendMail(this._contents, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });
    }

}

module.exports = EmailTransporter;