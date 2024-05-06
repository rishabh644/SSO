import React from "react";
import "./SearchBar.css";

// So far it's possible to search only thgough city name
class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			term: "",
		};
		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}

	// This search method actually runs a search method from
	// the APP component. That's why: this.PROPS....
	search() {
		this.props.onSearch(this.state.term);
	}

	handleTermChange(event) {
		this.setState({ term: event.target.value });
	}

	render() {
		return (
			<div>
				<div className="container w-75 searchBar">
					<input
						type="text"
						className="form-control"
						placeholder="City..."
						aria-label="City..."
						aria-describedby="button-addon2"
						onChange={this.handleTermChange}
					/>
					<div className="input-group-append">
						<button
							className="btn btn-outline-success"
							type="button"
							onClick={this.search}
						>
							Search
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default SearchBar;
