import * as d3 from 'd3';

import { IDropDownOption } from '../common/interfaces';
import { IDropDownList } from '../common/interfaces';

interface IFilters {
	year: string;
	region: string;
	department: string;
	statistic: string;
}

interface IAnalyticsController {
	// getData(): void;
	addFilter(option: IDropDownOption, filter: string): void;
}

let context: any = null;

class AnalyticsController implements IAnalyticsController {
	public units: string;
	public data: any[];
	public allYears: IDropDownList = [
        {
            title: '2015',
            key: '2015'
        },
		{
			title: '2014',
			key: '2014'
		},
        {
            title: '2013',
            key: '2013'
        }
	];

	public statistic: IDropDownList = [
		{
			title: 'Найбільший дохід',
			key: 'i'
		},
        {
            title: 'Найбільший дохід сім’ї',
            key: 'm'
        },
        {
            title: 'Найбільша площа земельних ділянок',
            key: 'l'
        },
        {
            title: 'Найбільша кількість земельних ділянк',
            key: 'z'
        },
		{
			title: 'Найбільша площа домівок',
			key: 'h'
		},
        {
            title: 'Найбільша кількість домівок',
            key: 'e'
        },
        {
            title: 'Найбільша площа квартир',
            key: 'f'
        },
        {
            title: 'Найбільша кількість квартир',
            key: 't'
        },
        {
            title: 'Найбільша кількість машин',
            key: 'с'
        },
        {
            title: 'Найбільше грошей в банку',
            key: 'b'
        },
        {
            title: 'Найбільша кількість скарг',
            key: 'j'
        },
        {
            title: 'Найбільша кількість розглянутих справ',
            key: 'w'
        }
	];

	public allRegions: IDropDownList;
	// public filtersByDepartments: IDropDownList;
	public filterByIncomes: any = [];
	public filtersApplied: any = false;
	public availableDepartments: any;

	private $scope: any;
	private _api: any;
	private filters: IFilters = {
		year: '',
		region: '',
		department: '',
		statistic: ''
	};
	private originalData: any[];
	private $filter: any;
	private originalDepartments: any;


	/* @ngInject */
	constructor(Api: any, $scope: angular.IScope, $filter: angular.IFilterProvider) {
		context = this;

		this._api = Api;
		this.$scope = $scope;

		this._api.getJudgesList()
			.then(resp => {
				this.data = resp;
				this.originalData = angular.copy(resp);
				return this._api.getDepartments();
			})
			.then((res) => {
				this.originalDepartments = res;
				this.availableDepartments = this.reduceDepartments(this.originalDepartments );
				debugger;
				return this._api.getRegions();
			})
			.then(resp => {
				debugger;
				this.allRegions = resp;
				$scope.$applyAsync();
			});

	}

	/** @ngInject */

	addFilter(option: IDropDownOption, filter: string) {
		if(filter === 'region') {
			context.availableDepartments = context.filterDepartmentByRegion(context.originalDepartments, option.key);
			debugger;
			context.$scope.$evalAsync();
		}
		context.filters[filter] = option.key;
        context.filterApply();
	}

	filterApply() {
		this.data = this.originalData;

		if (this.filters.year) {
			this.data = this.$filter('filterByYear')(this.data, parseInt(this.filters.year, 10));
		}
		if (this.filters.region) {
			this.data = this.$filter('filterByField')(this.data, this.filters.region, 'r');
		}
		if (this.filters.department) {
			this.data = this.$filter('filterByField')(this.data, this.filters.department, 'd');
		}
		// if (this.filters.department) {
		// 	this.data = this.$filter('filterByField')(this.data, this.filters.department, 'd');
		// }
		if (this.filters.statistic) {
			this.data = this.$filter('filterByAnalyticsField')(this.data, this.filters.statistic);
			this.units = (this.filters.statistic === 'i') ? 'грн' : '';
		}
	}

	private filterDepartmentByRegion (departmentRegionsObj, region) {
		let availableDepartments = [];

		if(region) {
			availableDepartments = departmentRegionsObj[region];
		} else {
			availableDepartments = this.reduceDepartments(departmentRegionsObj);
		}
		debugger;
		return availableDepartments
	}

	private reduceDepartments (obj) {
		let reduced = [];

		for (let key in obj) {
			reduced = reduced.concat(obj[key]);
		}
		debugger;
		return reduced;
	}
}

export { AnalyticsController };
