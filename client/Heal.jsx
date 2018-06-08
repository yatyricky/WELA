import React from "react";
import Highcharts from "highcharts";
import Drilldown from "highcharts/modules/drilldown";
import HighchartsReact from "highcharts-react-official"; // eslint-disable-line no-unused-vars
import { registerDataUpdated, unregisterDataUpdated, getCurrentCombatData } from "./DataStore.js";
import config from "./Configs.js";

if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
    Drilldown(Highcharts);
}

class Heal extends React.Component {

    constructor(props) {
        super(props);
        this.reloadData = this.reloadData.bind(this);
        this.state = {
            data: getCurrentCombatData()
        };
        registerDataUpdated(this.reloadData);
    }

    componentWillUnmount() {
        unregisterDataUpdated(this.reloadData);
    }

    reloadData(combatData) {
        this.setState({
            data: null
        });
        setTimeout(() => {
            this.setState({
                data: combatData
            });
        }, 0.1);

    }

    render() {
        let contents = null;
        if (this.state.data != null) {
            const tableEntries = [];
            let hconfigHPS = {
                xAxis: [],
                data: [],
                units: {}
            };
            let hconfigHealing = {
                seriesOverflow: [],
                seriesEffective: [],
                drilldown: [],
                units: {},
                total: 0.0
            };
            // calculate chunks
            let first = Math.floor(this.state.data.start);
            let n = Math.ceil((this.state.data.end - first) / config.xpsInterval);
            for (let i = 0; i < n + 1; i++) {
                hconfigHPS.xAxis.push(first + i * config.xpsInterval);
            }
            // start the loop
            n = 0;
            for (let i = 0; i < this.state.data.healings.length; i++) {
                const element = this.state.data.healings[i];
                // table
                tableEntries.push(
                    <tr key={i}>
                        <td>{element.time}</td>
                        <td>{element.source}</td>
                        <td>{element.target}</td>
                        <td>{element.name}</td>
                        <td>{element.amount}</td>
                        <td>{element.overflow}</td>
                    </tr>
                );
                // hc HPS
                if (hconfigHPS.units.hasOwnProperty(element.source) == false) {
                    hconfigHPS.units[element.source] = {
                        sourceT: element.sourceT,
                        data: []
                    };
                    for (let j = 0; j < hconfigHPS.xAxis.length; j++) {
                        hconfigHPS.units[element.source].data.push(0);
                    }
                }
                if (element.time > hconfigHPS.xAxis[n + 1]) {
                    n += 1;
                }
                hconfigHPS.units[element.source].data[n] += element.amount + element.overflow;
                // hc healings
                if (hconfigHealing.units.hasOwnProperty(element.source) == false) {
                    hconfigHealing.units[element.source] = {
                        sumEffective: 0.0,
                        sumOverflow: 0.0,
                        career: element.sourceT,
                        abils: {}
                    };
                }
                if (hconfigHealing.units[element.source].abils.hasOwnProperty(element.name) == false) {
                    hconfigHealing.units[element.source].abils[element.name] = {
                        effective: 0.0,
                        overflow: 0.0
                    };
                }
                hconfigHealing.units[element.source].abils[element.name].effective += element.amount;
                hconfigHealing.units[element.source].abils[element.name].overflow += element.overflow;
                hconfigHealing.units[element.source].sumEffective += element.amount;
                hconfigHealing.units[element.source].sumOverflow += element.overflow;
                hconfigHealing.total += element.amount + element.overflow;
            }
            let keys = Object.keys(hconfigHPS.units);
            for (let i = 0; i < keys.length; i++) {
                const element = hconfigHPS.units[keys[i]];
                const seriesData = [];
                for (let j = 0; j < element.data.length - 1; j++) {
                    seriesData.push(element.data[j] / config.xpsInterval);
                }
                hconfigHPS.data.push({
                    name: keys[i],
                    data: seriesData,
                    visible: element.sourceT == "healer"
                });
            }
            // damage breakdown
            keys = Object.keys(hconfigHealing.units);
            for (let i = 0; i < keys.length; i++) {
                const element = hconfigHealing.units[keys[i]];
                if (element.career == "healer") {
                    hconfigHealing.seriesEffective.push({
                        name: keys[i],
                        drilldown: `e${i}`,
                        levelNumber: 1,
                        y: (element.sumEffective / hconfigHealing.total) * 100.0
                    });
                    hconfigHealing.seriesOverflow.push({
                        name: keys[i],
                        drilldown: `o${i}`,
                        levelNumber: 1,
                        y: (element.sumOverflow / hconfigHealing.total) * 100.0
                    });
                    let drillDownObjEff = {
                        type: "pie",
                        id: `e${i}`,
                        data: []
                    };
                    let drillDownObjOvf = {
                        type: "pie",
                        id: `o${i}`,
                        data: []
                    };
                    const abilKeys = Object.keys(element.abils);
                    for (let j = 0; j < abilKeys.length; j++) {
                        const elem = element.abils[abilKeys[j]];
                        drillDownObjEff.data.push({
                            name: abilKeys[j],
                            y: elem.effective
                        });
                        drillDownObjOvf.data.push({
                            name: abilKeys[j],
                            y: elem.overflow
                        });
                    }
                    // drillDownObj.data.sort((a, b) => {
                    //     return b[1] - a[1];
                    // });
                    hconfigHealing.drilldown.push(drillDownObjEff);
                    hconfigHealing.drilldown.push(drillDownObjOvf);
                }
            }
            // hconfigHealing.series.sort((a, b) => {
            //     return b.y - a.y;
            // });
            // highcharts configs
            const highConfigHps = {
                chart: {
                    type: "spline"
                },
                title: {
                    text: "HPS Curve"
                },
                xAxis: {
                    categories: hconfigHPS.xAxis
                },
                yAxis: {
                    title: {
                        text: "HPS"
                    }
                },
                legend: {
                    layout: "vertical",
                    align: "right",
                    verticalAlign: "middle"
                },
                series: hconfigHPS.data
            };
            const highConfigHealing = {
                chart: {
                    type: "bar"
                },
                title: {
                    text: "Healings Breakdown"
                },
                xAxis: {
                    type: "category"
                },
                yAxis: {
                    title: {
                        text: "Total Healings"
                    }
                },
                legend: {
                    reversed: true
                },
                plotOptions: {
                    series: {
                        stacking: "normal"
                    }
                },
                tooltip: {
                    pointFormatter: function () {
                        if (this.levelNumber == 1) {
                            return `<span style='color:${this.series.color}'>\u25CF</span>${this.series.name}: <b>${this.y.toFixed(2)}%</b><br/>`;
                        } else {
                            return `<span style='color:${this.color}'>\u25CF</span>: <b>${this.y.toFixed(2)} (${this.percentage.toFixed(2)}%)</b><br/>`;
                        }
                    }
                },

                series: [{
                    name: "Overflow",
                    color: "#f15c80",
                    data: hconfigHealing.seriesOverflow
                }, {
                    name: "Effective",
                    color: "#90ed7d",
                    data: hconfigHealing.seriesEffective
                }],
                drilldown: {
                    series: hconfigHealing.drilldown
                }
            };
            contents = (
                <div>
                    <HighchartsReact highcharts={Highcharts} options={highConfigHps} />
                    <HighchartsReact highcharts={Highcharts} options={highConfigHealing} />
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Source</th>
                                <th>Target</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Overflow</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableEntries}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            contents = <div>No data</div>;
        }
        return (
            <div>
                <h3 className="page-header">Healings</h3>
                {contents}
            </div>
        );
    }

}

export default Heal;