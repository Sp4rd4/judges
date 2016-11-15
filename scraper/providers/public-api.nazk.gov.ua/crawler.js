"use strict";
let fetch = require('../../helpers/fetch-json');
let Promise = require('bluebird');
let _ = require("lodash");
let levenshteinStringDistance = require("levenshtein-string-distance");
let writeFile = Promise.promisify(require('fs').writeFile);
const NAME = "public-api.nazk.gov.ua";
const input = require("./../../input/index");
const output = require("./../../output/index");
const inJudgeModel = require("./../../input/judge.json");
const outJudgeModel = require("./../../output/judge.json");
const homonymsBlacklistDeclarationsComUaKeys = {
    melnik_oleksandr_mihaylovich_novomoskovskiy_miskrayonniy_dnipropetrovskoyi_oblasti: ["vulyk_66_51", "vulyk_11_177"],
    melnik_oleksandr_mihaylovich_mikolayivskiy_okruzhniy_administrativniy_sud: ["vulyk_77_27", "vulyk_11_177"],
    tkachenko_oleg_mikolayovich: ["vulyk_30_158"],
    mikulyak_pavlo_pavlovich_zakarpatskiy_okruzhniy_administrativniy_sud: ["vulyk_68_5"],
    mikulyak_pavlo_pavlovich_uzhgorodskiy_miskrayonniy_sud_zakarpatskoyi_oblasti: ["vulyk_67_185"],
    shevchenko_oleksandr_volodimirovich: ["vulyk_35_200"],
    dyachuk_vasil_mikolayovich: ["vulyk_28_124"]
};
function getSearchLink(s) {
    console.log("search " + s);
    s = encodeURI(s);
    return `https://public-api.nazk.gov.ua/v1/declaration/?q=${s}`;
}
function getDeclarationLink(id) {
    return `https://public-api.nazk.gov.ua/v1/declaration/${id}`;
}


module.exports = function searchDeclaration(judge) {

    return fetch(getSearchLink(judge[inJudgeModel.name]))
        .then(response => {
            var uniq, duplicatedYears, groupedDuplicates;

            return _.filter(_.get(response, "items"), declarationPointer => {
                    var given = _.lowerCase(judge[inJudgeModel.name]);
                    var fetched = _.lowerCase(declarationPointer.lastname + " " + declarationPointer.firstname);
                    return levenshteinStringDistance(given, fetched) <= 1;
                })
                // .tap(declarationPointers => {
                //     uniq = _.countBy(response, d => _.get(d, "intro.declaration_year"));
                //     duplicatedYears = Object.keys(uniq).filter((a) => uniq[a] > 1);
                //     if (_.size(duplicatedYears)) {
                //         groupedDuplicates = _.groupBy(response, d => _.get(d, "intro.declaration_year"));
                //     }
                //     return declarations;
                // })
                // .filter(function (declarationPointers, index, declarations) {
                //     if (_.size(duplicatedYears) && _.includes(duplicatedYears, _.get(declarationPointers, "intro.declaration_year"))) {
                //         debugger;
                //     }
                //     if (_.includes(_.keys(homonymsBlacklistDeclarationsComUaKeys[judge.key]), judge.key)) {
                //         debugger;
                //     }
                //     return true;
                // })

        })
        .then(declarationPointer => {
            return fetch(getDeclarationLink(declarationPointer.id))
        })
        .then(declarations => {
            "declarationYear1";
            declarations;
        })
        // .sortBy(declaration => -parseInt(_.get(declaration, "intro.declaration_year"), 10))
        // .value();
        .then(declarations => {
            return writeFile(`../../../edeclarations/${judge.key}.json`, JSON.stringify(declarations))
                .then(() => {
                    return _.map(declarations, declaration => {
                        return {
                            provider: NAME,
                            declaration: declaration
                        };
                    });
                });
        })
        .catch(function (e) {
            throw new Error(e.message);
        })
};
