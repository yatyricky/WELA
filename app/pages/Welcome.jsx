import React from 'react';
import DataStore from '../DataStore.js';
import FileDrop from 'react-file-drop';

const dragDefaultStyle = "form-control drop-area";
const dragOverStyle = "form-control drop-area drop-area-drag-over";

class Welcome extends React.Component {
    constructor() {
        super();
        this.state = {
            "dropStyle": dragDefaultStyle,
            "progressI": -1,
            "progressN": -1
        }
        this.dataStore = new DataStore();
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.handleFileOver = this.handleFileOver.bind(this);
        this.handleFileLeft = this.handleFileLeft.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
    }

    renderResult() {
        if (this.state.progressN < 1) {
            return (<div />);
        } else {
            return (
                <div>Progress: {`${this.state.progressI}/${this.state.progressN}`}</div>
            );
        }
    }

    updateProgress() {
        this.setState({
            "progressI": this.dataStore.doneFiles,
            "progressN": this.dataStore.numFiles
        });
        if (this.dataStore.hasData()) {
            // update UI
        }
    }

    handleFileDrop(files, event) {
        this.dataStore.parse(files, this.updateProgress);
        this.handleFileLeft(null);
    }

    handleFileOver(event) {
        if (this.state.dropStyle == dragDefaultStyle) {
            this.setState({dropStyle: dragOverStyle});
        }
    }

    handleFileLeft(event) {
        if (this.state.dropStyle == dragOverStyle) {
            this.setState({dropStyle: dragDefaultStyle});
        }
    }

    render() {
        return (
            <div>
                <h1 className="page-header">将日志文件拖入下方框内以开始分析</h1>
                <div className="form-group">
                    <FileDrop className={this.state.dropStyle} frame={document} onDrop={this.handleFileDrop} onDragOver={this.handleFileOver} onDragLeave={this.handleFileLeft} />
                </div>
                {this.renderResult()}
            </div>
        );
    }

}

export default Welcome;