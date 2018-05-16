import React from "react";
import ReactHighcharts from "react-highcharts";
import { registerDataUpdated, unregisterDataUpdated, getCurrentCombatData } from "./DataStore.js";
import config from "./Configs.js";

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

            contents = (
                <div>
                    <ReactHighcharts config={highConfigDps} />
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