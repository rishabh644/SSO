import React from "react";
import "./WeeklyData.css";
import weatherApi from "../../util/weatherApi";

// Get the weekly data, it creates a timeline per:
//    - week day, icon, max and min temp
class WeeklyData extends React.Component {
	constructor(props) {
		super(props);
		this.getWeeklyData = this.getWeeklyData.bind(this);
	}

	getWeeklyData(forecastWeekly) {
		return weatherApi.getWeeklyData(forecastWeekly);
	}

	render() {
		const weeklyData = this.getWeeklyData(this.props.forecastWeekly);
		return (
			<div className="row rowWeeklyData">
				<div className="table-responsive">
					<table className="table table-borderless">
						<tbody>
							<tr>
								{weeklyData.map((forecast) => {
									return <td key={forecast.weekday}>{forecast.weekday}</td>;
								})}
							</tr>
							<tr>
								{weeklyData.map((forecast) => {
									return (
										<td key={forecast.weekday} className="weeklyData">
											<img src={forecast.weather_icon} alt="" />
										</td>
									);
								})}
							</tr>
							<tr>
								{weeklyData.map((forecast) => {
									return (
										<td key={forecast.weekday} className="weeklyData">
											{forecast.max}° | {forecast.min}°
										</td>
									);
								})}
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default WeeklyData;
