import React from "react";
import ReactHighcharts from "react-highcharts";
import DataStore from "./DataStore.js";

class Heal extends React.Component {

    constructor() {
        super();
        this.badPractiseIsMounted = 0;
        this.dataStore = new DataStore();

        this.state = {
            "activeLog": this.dataStore.activeLog,
            "raw": []
        };

        this.parseData = this.parseData.bind(this);
        this.updateData = this.updateData.bind(this);

        this.dataStore.registerUpdateDamage(this.updateData);
    }

    updateData() {
        if (this.badPractiseIsMounted === 1) {
            this.setState({
                "activeLog": this.dataStore.activeLog,
                "raw": this.dataStore.fetchLog("heal")
            });
        }
    }

    componentDidMount() {
        this.badPractiseIsMounted = 1;
        this.updateData();
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

            /*
            {
                "Alice": {
                    "Smash": 15,
                    "Blast": 42
                },
                "Bob": {
                    "Squeeze": 33,
                    "Toss": 19,
                    "Stomp": 76
                }
            }
            */
            let methodDamages = {};
            let methodOverflows = {};

            for (let i = 0, n = raw.length; i < n; i++) {
                // init unit data
                if (units.hasOwnProperty(raw[i][2]) == false) {
                    units[raw[i][2]] = {
                        "current": 0,
                        "chunks": []
                    };
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
                units[raw[i][2]].current += parseFloat(raw[i][5]) + parseFloat(raw[i][6]);

                // heal breakdown
                if (methodDamages.hasOwnProperty(raw[i][2]) == false) {
                    methodDamages[raw[i][2]] = {};
                }
                if (methodOverflows.hasOwnProperty(raw[i][2]) == false) {
                    methodOverflows[raw[i][2]] = {};
                }
                if (methodDamages[raw[i][2]].hasOwnProperty(raw[i][4]) == false) {
                    methodDamages[raw[i][2]][raw[i][4]] = 0;
                }
                if (methodOverflows[raw[i][2]].hasOwnProperty(raw[i][4]) == false) {
                    methodOverflows[raw[i][2]][raw[i][4]] = 0;
                }
                methodDamages[raw[i][2]][raw[i][4]] += parseFloat(raw[i][5]);
                methodOverflows[raw[i][2]][raw[i][4]] += parseFloat(raw[i][6]);

                // heal history table
                entries.push(
                    <tr key={i}>
                        <td>{raw[i][0]}</td>
                        <td>{raw[i][2]}</td>
                        <td>{raw[i][3]}</td>
                        <td>{raw[i][4]}</td>
                        <td className="text-right">{parseFloat(raw[i][5]).toFixed(3)}</td>
                        <td className="text-right">{parseFloat(raw[i][6]).toFixed(3)}</td>
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
            let seriesDataEffective = [];
            let seriesDataOverflow = [];
            let damageDrillDown = [];
            names = Object.keys(methodDamages);
            for (let i = 0, n = names.length; i < n; i++) {
                let techniques = Object.keys(methodDamages[names[i]]);
                let sumDamage = 0;
                let sumOverflow = 0;

                let categoryEffective = [];
                let categoryOverflow = [];

                for (let j = 0, m = techniques.length; j < m; j++) {
                    sumDamage += methodDamages[names[i]][techniques[j]];
                    sumOverflow += methodOverflows[names[i]][techniques[j]];

                    categoryEffective.push({
                        "name": techniques[j],
                        "y": methodDamages[names[i]][techniques[j]]
                    });
                    categoryOverflow.push({
                        "name": techniques[j],
                        "y": methodOverflows[names[i]][techniques[j]]
                    });
                }


                damageDrillDown.push({
                    "type": "pie",
                    "id": `e${i}`,
                    "data": categoryEffective
                });
                damageDrillDown.push({
                    "type": "pie",
                    "id": `o${i}`,
                    "data": categoryOverflow
                });


                let index = 0;
                while (index < seriesDataEffective.length) {
                    if (seriesDataEffective[index].y + seriesDataOverflow[index].y > sumDamage + sumOverflow) {
                        index ++;
                    } else {
                        break;
                    }
                }
                seriesDataEffective.splice(index, 0, {
                    "y": sumDamage,
                    "name": names[i],
                    "levelNumber": 1,
                    "drilldown": `e${i}`
                });
                seriesDataOverflow.splice(index, 0, {
                    "y": sumOverflow,
                    "name": names[i],
                    "levelNumber": 1,
                    "drilldown": `o${i}`
                });
            }

            // highcharts config
            const highConfigDps = {
                "title": {
                    "text": "HPS曲线"
                },
                "yAxis": {
                    "title": {
                        "text": "HPS"
                    }
                },
                "xAxis": {
                    "categories": timeChunks
                },
                tooltip: {
                    "valueSuffix": "",
                    "pointFormat": "{series.name}: <b>{point.y:.2f}</b>"
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
                    "text": "治疗构成"
                },
                "subtitle": {
                    "text": "点击治疗条以查看"
                },
                "xAxis": {
                    "type": "category"
                },
                "yAxis": {
                    "title": {
                        "text": "总治疗"
                    }
                },
                "legend": {
                    "reversed": true
                },
                "plotOptions": {
                    "series": {
                        "stacking": "normal"
                    }
                },
                "tooltip": {
                    "pointFormatter": function() {
                        if (this.levelNumber == 1) {
                            return "<span style='color:'"+this.series.color+">\u25CF</span>" + this.series.name + ": <b>" + this.y.toFixed(2) + "</b><br/>";
                        } else {
                            return "<span style='color:'"+this.color+">\u25CF</span>: <b>" + this.y.toFixed(2) + " (" + this.percentage.toFixed(2) + "%)</b><br/>";
                        }
                    }
                },

                "series": [{
                    "name": "过量治疗",
                    "color": "#f15c80",
                    "data": seriesDataOverflow
                }, {
                    "name": "有效治疗",
                    "color": "#90ed7d",
                    "data": seriesDataEffective
                }],
                "drilldown": {
                    "series": damageDrillDown
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
                                    <th>时间</th>
                                    <th>治疗来源</th>
                                    <th>治疗目标</th>
                                    <th>技能</th>
                                    <th>有效治疗</th>
                                    <th>过量治疗</th>
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
                <h1 className="page-header">Healing</h1>
                {this.parseData()}
            </div>
        );
    }

}

export default Heal;