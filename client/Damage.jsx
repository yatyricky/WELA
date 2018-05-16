import React from "react";
import Highcharts from "highcharts";
import Drilldown from "highcharts/modules/drilldown";
import HighchartsReact from "highcharts-react-official";
import { registerDataUpdated, unregisterDataUpdated, getCurrentCombatData } from "./DataStore.js";
import config from "./Configs.js";

Drilldown(Highcharts);

class Damage extends React.Component {

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
            data: combatData
        });
    }

    render() {
        let contents = null;
        if (this.state.data != null) {
            const tableEntries = [];
            let hconfigDPS = {
                xAxis: [],
                data: [],
                current: -1,
                units: {},
                i: -1
            };
            let hconfigDamage = {
                series: [],
                drilldown: [],
                units: {},
                total: 0.0
            };
            let i = 0;
            for (; i < this.state.data.damages.length; i++) {
                const element = this.state.data.damages[i];
                // table
                tableEntries.push(
                    <tr key={i}>
                        <td>{element.time}</td>
                        <td>{element.source}</td>
                        <td>{element.target}</td>
                        <td>{element.name}</td>
                        <td>{element.amount}</td>
                    </tr>
                );
                // hc DPS
                if (hconfigDPS.current == -1) {
                    hconfigDPS.current = Math.floor(element.time);
                }
                if (element.time >= hconfigDPS.current + config.xpsInterval) {
                    // next chunk
                    hconfigDPS.xAxis.push(hconfigDPS.current);
                    hconfigDPS.current += config.xpsInterval;
                    hconfigDPS.i += 1;
                    for (let j = 0; j < hconfigDPS.data.length; j++) {
                        const elem = hconfigDPS.data[j];
                        let k = elem.data.length;
                        while (k < hconfigDPS.i) {
                            elem.data.push(0);
                            k += 1;
                        }
                        elem.data.push(hconfigDPS.units[elem.name] / config.xpsInterval);
                        hconfigDPS.units[elem.name] = 0;
                    }
                }
                if (hconfigDPS.units.hasOwnProperty(element.source) == false) {
                    hconfigDPS.units[element.source] = 0;
                    hconfigDPS.data.push({
                        name: element.source,
                        data: [],
                        visible: element.sourceT == "dps"
                    });
                }
                hconfigDPS.units[element.source] += element.amount;
                // hc damage
                if (hconfigDamage.units.hasOwnProperty(element.source) == false) {
                    hconfigDamage.units[element.source] = {
                        sum: 0.0,
                        abils: {}
                    };
                }
                if (hconfigDamage.units[element.source].abils.hasOwnProperty(element.name) == false) {
                    hconfigDamage.units[element.source].abils[element.name] = 0.0;
                }
                hconfigDamage.units[element.source].abils[element.name] += element.amount;
                hconfigDamage.units[element.source].sum += element.amount;
                hconfigDamage.total += element.amount;
            }
            // last bit
            hconfigDPS.xAxis.push(hconfigDPS.current);
            hconfigDPS.i += 1;
            for (let j = 0; j < hconfigDPS.data.length; j++) {
                const elem = hconfigDPS.data[j];
                let k = elem.data.length;
                while (k < hconfigDPS.i) {
                    elem.data.push(0);
                    k += 1;
                }
                elem.data.push(hconfigDPS.units[elem.name] / config.xpsInterval);
                hconfigDPS.units[elem.name] = 0;
            }
            // damage breakdown
            const keys = Object.keys(hconfigDamage.units);
            for (i = 0; i < keys.length; i++) {
                const element = hconfigDamage.units[keys[i]];
                hconfigDamage.series.push({
                    name: keys[i],
                    drilldown: keys[i],
                    y: (element.sum / hconfigDamage.total) * 100.0
                });
                const drillDownObj = {
                    name: keys[i],
                    id: keys[i],
                    data: []
                };
                const abilKeys = Object.keys(element.abils);
                for (let j = 0; j < abilKeys.length; j++) {
                    const elem = element.abils[abilKeys[j]];
                    drillDownObj.data.push([
                        abilKeys[j],
                        (elem / element.sum) * 100.0
                    ]);
                }
                drillDownObj.data.sort((a, b) => {
                    return b[1] - a[1];
                });
                hconfigDamage.drilldown.push(drillDownObj);
            }
            hconfigDamage.series.sort((a, b) => {
                return b.y - a.y;
            });

            const highConfigDps = {
                chart: {
                    type: "spline"
                },
                title: {
                    text: "DPS Curve"
                },
                xAxis: {
                    categories: hconfigDPS.xAxis
                },
                yAxis: {
                    title: {
                        text: "DPS"
                    }
                },
                legend: {
                    layout: "vertical",
                    align: "right",
                    verticalAlign: "middle"
                },
                series: hconfigDPS.data
            };
            const highConfigDamage = {
                chart: {
                    type: "bar"
                },
                title: {
                    text: "Damage Breakdown"
                },
                xAxis: {
                    type: "category"
                },
                yAxis: {
                    title: {
                        text: "Damage Percent"
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: "{point.y:.1f}%"
                        }
                    }
                },
                tooltip: {
                    headerFormat: "<span style='font-size:11px'>{series.name}</span><br>",
                    pointFormat: "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y:.2f}%</b><br/>"
                },
                series: [{
                    name: "Browsers",
                    colorByPoint: true,
                    data: hconfigDamage.series
                }],
                drilldown: {
                    series: hconfigDamage.drilldown
                }
            };
            contents = (
                <div>
                    <HighchartsReact highcharts={Highcharts} options={highConfigDps} />
                    <HighchartsReact highcharts={Highcharts} options={highConfigDamage} />
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Source</th>
                                <th>Target</th>
                                <th>Name</th>
                                <th>Amount</th>
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
                <h3 className="page-header">Damage</h3>
                {contents}
            </div>
        );
    }

}

export default Damage;