import React from "react";
import Highcharts from "highcharts";
import Drilldown from "highcharts/modules/drilldown";
import HighchartsReact from "highcharts-react-official"; // eslint-disable-line no-unused-vars
import Table from "@material-ui/core/Table"; // eslint-disable-line no-unused-vars
import TableRow from "@material-ui/core/TableRow"; // eslint-disable-line no-unused-vars
import TableCell from "@material-ui/core/TableCell"; // eslint-disable-line no-unused-vars
import TableBody from "@material-ui/core/TableBody"; // eslint-disable-line no-unused-vars
import TableHead from "@material-ui/core/TableHead"; // eslint-disable-line no-unused-vars
import { registerDataUpdated, unregisterDataUpdated, getCurrentCombatData } from "./DataStore.js";
import config from "./Configs.js";

if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
    Drilldown(Highcharts);
}

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
            let hconfigDPS = {
                xAxis: [],
                data: [],
                units: {},
            };
            let hconfigDamage = {
                series: [],
                drilldown: [],
                units: {},
                total: 0.0
            };
            // calculate chunks
            let first = Math.floor(this.state.data.start);
            let n = Math.ceil((this.state.data.end - first) / config.xpsInterval);
            for (let i = 0; i < n + 1; i++) {
                hconfigDPS.xAxis.push(first + i * config.xpsInterval);
            }
            // start the loop
            n = 0;
            for (let i = 0; i < this.state.data.damages.length; i++) {
                const element = this.state.data.damages[i];
                // table
                tableEntries.push(
                    <TableRow key={i}>
                        <TableCell>{element.time}</TableCell>
                        <TableCell>{element.source}</TableCell>
                        <TableCell>{element.target}</TableCell>
                        <TableCell>{element.name}</TableCell>
                        <TableCell>{element.amount}</TableCell>
                    </TableRow>
                );
                // hc DPS
                if (hconfigDPS.units.hasOwnProperty(element.source) == false) {
                    hconfigDPS.units[element.source] = {
                        career: element.sourceT,
                        data: []
                    };
                    for (let j = 0; j < hconfigDPS.xAxis.length; j++) {
                        hconfigDPS.units[element.source].data.push(0);
                    }
                }
                if (element.time > hconfigDPS.xAxis[n + 1]) {
                    n += 1;
                }
                hconfigDPS.units[element.source].data[n] += element.amount;
                // hc damage
                if (hconfigDamage.units.hasOwnProperty(element.source) == false) {
                    hconfigDamage.units[element.source] = {
                        sum: 0.0,
                        career: element.sourceT,
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
            // hc DPS
            let keys = Object.keys(hconfigDPS.units);
            for (let i = 0; i < keys.length; i++) {
                const element = hconfigDPS.units[keys[i]];
                const seriesData = [];
                for (let j = 0; j < element.data.length - 1; j++) {
                    seriesData.push(element.data[j] / config.xpsInterval);
                }
                hconfigDPS.data.push({
                    name: keys[i],
                    data: seriesData,
                    visible: element.career == "dps" || element.career == "tank" || element.career == "minion"
                });
            }
            // damage breakdown
            keys = Object.keys(hconfigDamage.units);
            for (let i = 0; i < keys.length; i++) {
                const element = hconfigDamage.units[keys[i]];
                if (element.career == "dps" || element.career == "tank" || element.career == "minion") {
                    hconfigDamage.series.push({
                        name: keys[i],
                        drilldown: keys[i],
                        y: (element.sum / hconfigDamage.total) * 100.0
                    });
                    const drillDownObj = {
                        name: keys[i],
                        type: "pie",
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
                        borderWidth: 0
                    }
                },
                tooltip: {
                    headerFormat: "<span style='font-size:11px'>{series.name}</span><br>",
                    pointFormat: "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y:.2f}%</b><br/>"
                },
                series: [{
                    name: "DPS",
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableEntries}
                        </TableBody>
                    </Table>
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