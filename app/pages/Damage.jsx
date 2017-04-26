import React from 'react';
import ReactHighcharts from 'react-highcharts';
import HighchartsDrilldown from 'highcharts-drilldown';
import DataStore from '../DataStore.js';

HighchartsDrilldown(ReactHighcharts.Highcharts);

class Damage extends React.Component {

    constructor() {
        super();
        this.badPractiseIsMounted = 0;
        this.dataStore = new DataStore();

        this.state = {
            "activeLog": this.dataStore.activeLog,
            "raw": []
        };

        this.parseData = this.parseData.bind(this);
        this.updateDamage = this.updateDamage.bind(this);

        this.dataStore.registerUpdateDamage(this.updateDamage);
    }

    updateDamage() {
        if (this.badPractiseIsMounted === 1) {
            this.setState({
                "activeLog": this.dataStore.activeLog,
                "raw": this.dataStore.fetchLog("damage")
            });
        }
    }

    componentDidMount() {
        this.badPractiseIsMounted = 1;
        this.updateDamage();
    }

    componentWillUnmount() {
        this.badPractiseIsMounted = 0;
    }

    parseData() {
        if (this.state.raw.length > 0) {
            // table raw data
            let {raw} = this.state;
            let entries = [];

            let niddle = Math.floor(parseFloat(raw[0][0]));
            let timeChunks = [];
            let units = {};

            let methodDamages = {};

            for (let i = 0, n = raw.length; i < n; i++) {
                // init unit data
                if (units.hasOwnProperty(raw[i][2]) == false) {
                    units[raw[i][2]] = {
                        "current": 0,
                        "chunks": []
                    }
                }
                // next chunk
                if (niddle + 5 <= parseFloat(raw[i][0])) {
                    timeChunks.push(niddle);
                    let names = Object.keys(units);
                    for (let j = 0, m = names.length; j < m; j++) {
                        units[names[j]].chunks.push(units[names[j]].current / 5.0);
                        units[names[j]].current = 0;
                    }
                    niddle += 5;
                }
                units[raw[i][2]].current += parseFloat(raw[i][5]);
                // damage breakdown
                if (methodDamages.hasOwnProperty(raw[i][2]) == false) {
                    methodDamages[raw[i][2]] = {};
                }
                if (methodDamages[raw[i][2]].hasOwnProperty(raw[i][4]) == false) {
                    methodDamages[raw[i][2]][raw[i][4]] = 0;
                }
                methodDamages[raw[i][2]][raw[i][4]] += parseFloat(raw[i][5]);

                entries.push(
                    <tr key={i}>
                        <td>{raw[i][0]}</td>
                        <td>{raw[i][2]}</td>
                        <td>{raw[i][3]}</td>
                        <td>{raw[i][4]}</td>
                        <td className="text-right">{raw[i][5]}</td>
                    </tr>
                );
            }

            // build dps curve
            let unitDpss = [];
            let names = Object.keys(units);
            for (let i = 0, n = names.length; i < n; i++) {
                unitDpss.push({
                    "name": names[i],
                    "data": units[names[i]].chunks
                });
            }

            // build damage breakdown
            let bulkDamage = [];
            let drillDamage = [];
            names = Object.keys(methodDamages);
            for (let i = 0, n = names.length; i < n; i++) {
                let techniques = Object.keys(methodDamages[names[i]]);
                let sum = 0;
                let drillData = [];
                for (let j = 0, m = techniques.length; j < m; j++) {
                    sum += methodDamages[names[i]][techniques[j]];
                    drillData.push([techniques[j], methodDamages[names[i]][techniques[j]]]);
                }
                bulkDamage.push({
                    "name": names[i],
                    "y": sum,
                    "drilldown": names[i]
                });
                drillDamage.push({
                    "name": names[i],
                    "id": names[i],
                    "data": drillData
                });
            }

            // highcharts config
            const highConfigDps = {
                "title": {
                    "text": "DPS曲线"
                },
                "yAxis": {
                    "title": {
                        "text": "DPS"
                    }
                },
                "xAxis": {
                    "categories": timeChunks
                },
                tooltip: {
                    "valueSuffix": '',
                    "pointFormat": '{series.name}: <b>{point.y:.2f}</b>'
                },
                "legend": {
                    "layout": "vertical",
                    "align": "right",
                    "verticalAlign": "middle"
                },
                "series": unitDpss
            };

            const highConfigDamage = {
                "chart": {
                    "type": "bar"
                },
                "title": {
                    "text": "伤害构成"
                },
                "subtitle": {
                    "text": "点击伤害条以查看"
                },
                "xAxis": {
                    "type": "category"
                },
                "yAxis": {
                    "title": {
                        "text": "总伤害"
                    }
                },
                "legend": {
                    "enabled": false
                },
                "plotOptions": {
                    "series": {
                        "borderWidth": 0,
                        "dataLabels": {
                            "enabled": true,
                            "format": "{point.y:.2f}%"
                        }
                    }
                },
                "tooltip": {
                    "headerFormat": '<span style="font-size:11px">{series.name}</span><br>',
                    "pointFormat": '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },

                series: [{
                    name: "damage construction",
                    colorByPoint: true,
                    data: bulkDamage
                }],
                drilldown: {
                    series: drillDamage
                }
            };
            return (
                <div>
                    <ReactHighcharts config={highConfigDps} />
                    <ReactHighcharts config={highConfigDamage} />
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>time</th>
                                    <th>source</th>
                                    <th>target</th>
                                    <th>method</th>
                                    <th>amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        } else {
            return (<div>没有数据</div>);
        }
    }

    render() {
        return (
            <div>
                <h1 className="page-header">伤害统计</h1>
                {this.parseData()}
            </div>
        );
    }

}

export default Damage;