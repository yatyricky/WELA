import React from 'react';

class Welcome extends React.Component {
    constructor() {
        super();
        this.postData = this.postData.bind(this);
        this.state = {
            "result": "waiting for res"
        }
    }

    postData(flag) {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'test.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xhr.onload = () => {
            if (xhr.status === 200) {
                const obj = JSON.parse(xhr.responseText);
                console.log(obj);
                this.setState({result: obj.post.result});
            } else if (xhr.status !== 200) {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send(encodeURI(`result=${flag}`));
        this.setState({result: "request sent, waiting for response"});
    }

    renderResult(flag) {
        let ret;
        switch (flag) {
            case "success":
                ret = (
                    <div>
                        <h1>{flag}</h1>
                        <p>I'm quite differernt!</p>
                    </div>
                );
                break;
            case "fail":
                ret = (<h2>{flag}</h2>);
                break;
            default:
                ret = (<div>{flag}</div>);
        }
        return ret;
    }

    render() {
        return (
            <div>
                <h1 className="page-header">将日志文件拖入下方虚线方框内以开始分析</h1>
                <button className="btn btn-success" onClick={() => this.postData("success")}>To Success</button>
                <button className="btn btn-danger" onClick={() => this.postData("fail")}>To Fail</button>
                <div>{this.renderResult(this.state.result)}</div>
            </div>
        );
    }

}

export default Welcome;