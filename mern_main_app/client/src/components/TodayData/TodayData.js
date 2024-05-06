import React from "react";
import "./TodayData.css";
import WeeklyData from "../WeeklyData/WeeklyData";
import GetGraph from "../GetGraph/GetGraph";

// Get the information regarding the today's weather.
class TodayData extends React.Component {
	render() {
		return (
			<div className="container weatherData w-75 border rounded">
				<div className="row currentCity justify-content-left">
					{this.props.city}, {this.props.country}
				</div>
				<div className="row currentDay">
					{this.props.weekday} {this.props.time}
				</div>
				<div className="row currentDesc justify-content-left">
					{this.props.weatherDescription}
				</div>
				<div className="row currentTemp justify-content-left">
					<img src={this.props.weatherIcon} alt="" />
					{this.props.temp}
					<span className="celsius">&#x2103;</span>
				</div>
				<GetGraph forecast3hrs={this.props.forecast3hrs} />
				<WeeklyData forecastWeekly={this.props.forecastWeekly} />
			</div>
		);
	}
}

export default TodayData;
