function getCountries() {
    return countries_db.database.country;
}

function getStatesForCountry(iso_code) {
    var c = getCountries();
    var country_id;
    for (var i in c) {
        var cc = c[i];
        if (cc.iso_code == iso_code) {
            country_id = cc.country_id;
            break;
        }
    }
    return countries_db.database.states[country_id];
}

var countries_db = {
    "database": {
        "country": [
            {
                "country_id": "1001",
                "name": "Afghanistan",
                "iso_code": "AF"
            },
            {
                "country_id": "1002",
                "name": "Albania",
                "iso_code": "AL"
            },
            {
                "country_id": "1003",
                "name": "Algeria",
                "iso_code": "DZ"
            },
            {
                "country_id": "1004",
                "name": "American Samoa",
                "iso_code": "AS"
            },
            {
                "country_id": "1005",
                "name": "Andorra",
                "iso_code": "AD"
            },
            {
                "country_id": "1006",
                "name": "Angola",
                "iso_code": "AO"
            },
            {
                "country_id": "1007",
                "name": "Anguilla",
                "iso_code": "AI"
            },
            {
                "country_id": "1008",
                "name": "Antarctica",
                "iso_code": "AQ"
            },
            {
                "country_id": "1009",
                "name": "Antigua and Barbuda",
                "iso_code": "AG"
            },
            {
                "country_id": "1010",
                "name": "Argentina",
                "iso_code": "AR"
            },
            {
                "country_id": "1011",
                "name": "Armenia",
                "iso_code": "AM"
            },
            {
                "country_id": "1012",
                "name": "Aruba",
                "iso_code": "AW"
            },
            {
                "country_id": "1013",
                "name": "Australia",
                "iso_code": "AU"
            },
            {
                "country_id": "1014",
                "name": "Austria",
                "iso_code": "AT"
            },
            {
                "country_id": "1015",
                "name": "Azerbaijan",
                "iso_code": "AZ"
            },
            {
                "country_id": "1016",
                "name": "Bahrain",
                "iso_code": "BH"
            },
            {
                "country_id": "1017",
                "name": "Bangladesh",
                "iso_code": "BD"
            },
            {
                "country_id": "1018",
                "name": "Barbados",
                "iso_code": "BB"
            },
            {
                "country_id": "1019",
                "name": "Belarus",
                "iso_code": "BY"
            },
            {
                "country_id": "1020",
                "name": "Belgium",
                "iso_code": "BE"
            },
            {
                "country_id": "1021",
                "name": "Belize",
                "iso_code": "BZ"
            },
            {
                "country_id": "1022",
                "name": "Benin",
                "iso_code": "BJ"
            },
            {
                "country_id": "1023",
                "name": "Bermuda",
                "iso_code": "BM"
            },
            {
                "country_id": "1024",
                "name": "Bhutan",
                "iso_code": "BT"
            },
            {
                "country_id": "1025",
                "name": "Bolivia",
                "iso_code": "BO"
            },
            {
                "country_id": "1026",
                "name": "Bosnia and Herzegovina",
                "iso_code": "BA"
            },
            {
                "country_id": "1027",
                "name": "Botswana",
                "iso_code": "BW"
            },
            {
                "country_id": "1028",
                "name": "Bouvet Island",
                "iso_code": "BV"
            },
            {
                "country_id": "1029",
                "name": "Brazil",
                "iso_code": "BR"
            },
            {
                "country_id": "1030",
                "name": "British Indian Ocean Territory",
                "iso_code": "IO"
            },
            {
                "country_id": "1031",
                "name": "Virgin Islands, British",
                "iso_code": "VG"
            },
            {
                "country_id": "1032",
                "name": "Brunei Darussalam",
                "iso_code": "BN"
            },
            {
                "country_id": "1033",
                "name": "Bulgaria",
                "iso_code": "BG"
            },
            {
                "country_id": "1034",
                "name": "Burkina Faso",
                "iso_code": "BF"
            },
            {
                "country_id": "1035",
                "name": "Myanmar",
                "iso_code": "MM"
            },
            {
                "country_id": "1036",
                "name": "Burundi",
                "iso_code": "BI"
            },
            {
                "country_id": "1037",
                "name": "Cambodia",
                "iso_code": "KH"
            },
            {
                "country_id": "1038",
                "name": "Cameroon",
                "iso_code": "CM"
            },
            {
                "country_id": "1039",
                "name": "Canada",
                "iso_code": "CA"
            },
            {
                "country_id": "1040",
                "name": "Cape Verde",
                "iso_code": "CV"
            },
            {
                "country_id": "1041",
                "name": "Cayman Islands",
                "iso_code": "KY"
            },
            {
                "country_id": "1042",
                "name": "Central African Republic",
                "iso_code": "CF"
            },
            {
                "country_id": "1043",
                "name": "Chad",
                "iso_code": "TD"
            },
            {
                "country_id": "1044",
                "name": "Chile",
                "iso_code": "CL"
            },
            {
                "country_id": "1045",
                "name": "China",
                "iso_code": "CN"
            },
            {
                "country_id": "1046",
                "name": "Christmas Island",
                "iso_code": "CX"
            },
            {
                "country_id": "1047",
                "name": "Cocos (Keeling) Islands",
                "iso_code": "CC"
            },
            {
                "country_id": "1048",
                "name": "Colombia",
                "iso_code": "CO"
            },
            {
                "country_id": "1049",
                "name": "Comoros",
                "iso_code": "KM"
            },
            {
                "country_id": "1050",
                "name": "Congo, The Democratic Republic of the",
                "iso_code": "CD"
            },
            {
                "country_id": "1051",
                "name": "Congo",
                "iso_code": "CG"
            },
            {
                "country_id": "1052",
                "name": "Cook Islands",
                "iso_code": "CK"
            },
            {
                "country_id": "1053",
                "name": "Costa Rica",
                "iso_code": "CR"
            },
            {
                "country_id": "1054",
                "name": "Côte d'Ivoire",
                "iso_code": "CI"
            },
            {
                "country_id": "1055",
                "name": "Croatia",
                "iso_code": "HR"
            },
            {
                "country_id": "1056",
                "name": "Cuba",
                "iso_code": "CU"
            },
            {
                "country_id": "1057",
                "name": "Cyprus",
                "iso_code": "CY"
            },
            {
                "country_id": "1058",
                "name": "Czech Republic",
                "iso_code": "CZ"
            },
            {
                "country_id": "1059",
                "name": "Denmark",
                "iso_code": "DK"
            },
            {
                "country_id": "1060",
                "name": "Djibouti",
                "iso_code": "DJ"
            },
            {
                "country_id": "1061",
                "name": "Dominica",
                "iso_code": "DM"
            },
            {
                "country_id": "1062",
                "name": "Dominican Republic",
                "iso_code": "DO"
            },
            {
                "country_id": "1063",
                "name": "Timor-Leste",
                "iso_code": "TL"
            },
            {
                "country_id": "1064",
                "name": "Ecuador",
                "iso_code": "EC"
            },
            {
                "country_id": "1065",
                "name": "Egypt",
                "iso_code": "EG"
            },
            {
                "country_id": "1066",
                "name": "El Salvador",
                "iso_code": "SV"
            },
            {
                "country_id": "1067",
                "name": "Equatorial Guinea",
                "iso_code": "GQ"
            },
            {
                "country_id": "1068",
                "name": "Eritrea",
                "iso_code": "ER"
            },
            {
                "country_id": "1069",
                "name": "Estonia",
                "iso_code": "EE"
            },
            {
                "country_id": "1070",
                "name": "Ethiopia",
                "iso_code": "ET"
            },
            {
                "country_id": "1072",
                "name": "Falkland Islands (Malvinas)",
                "iso_code": "FK"
            },
            {
                "country_id": "1073",
                "name": "Faroe Islands",
                "iso_code": "FO"
            },
            {
                "country_id": "1074",
                "name": "Fiji",
                "iso_code": "FJ"
            },
            {
                "country_id": "1075",
                "name": "Finland",
                "iso_code": "FI"
            },
            {
                "country_id": "1076",
                "name": "France",
                "iso_code": "FR"
            },
            {
                "country_id": "1077",
                "name": "French Guiana",
                "iso_code": "GF"
            },
            {
                "country_id": "1078",
                "name": "French Polynesia",
                "iso_code": "PF"
            },
            {
                "country_id": "1079",
                "name": "French Southern Territories",
                "iso_code": "TF"
            },
            {
                "country_id": "1080",
                "name": "Gabon",
                "iso_code": "GA"
            },
            {
                "country_id": "1081",
                "name": "Georgia",
                "iso_code": "GE"
            },
            {
                "country_id": "1082",
                "name": "Germany",
                "iso_code": "DE"
            },
            {
                "country_id": "1083",
                "name": "Ghana",
                "iso_code": "GH"
            },
            {
                "country_id": "1084",
                "name": "Gibraltar",
                "iso_code": "GI"
            },
            {
                "country_id": "1085",
                "name": "Greece",
                "iso_code": "GR"
            },
            {
                "country_id": "1086",
                "name": "Greenland",
                "iso_code": "GL"
            },
            {
                "country_id": "1087",
                "name": "Grenada",
                "iso_code": "GD"
            },
            {
                "country_id": "1088",
                "name": "Guadeloupe",
                "iso_code": "GP"
            },
            {
                "country_id": "1089",
                "name": "Guam",
                "iso_code": "GU"
            },
            {
                "country_id": "1090",
                "name": "Guatemala",
                "iso_code": "GT"
            },
            {
                "country_id": "1091",
                "name": "Guinea",
                "iso_code": "GN"
            },
            {
                "country_id": "1092",
                "name": "Guinea-Bissau",
                "iso_code": "GW"
            },
            {
                "country_id": "1093",
                "name": "Guyana",
                "iso_code": "GY"
            },
            {
                "country_id": "1094",
                "name": "Haiti",
                "iso_code": "HT"
            },
            {
                "country_id": "1095",
                "name": "Heard Island and McDonald Islands",
                "iso_code": "HM"
            },
            {
                "country_id": "1096",
                "name": "Holy See (Vatican City State)",
                "iso_code": "VA"
            },
            {
                "country_id": "1097",
                "name": "Honduras",
                "iso_code": "HN"
            },
            {
                "country_id": "1098",
                "name": "Hong Kong",
                "iso_code": "HK"
            },
            {
                "country_id": "1099",
                "name": "Hungary",
                "iso_code": "HU"
            },
            {
                "country_id": "1100",
                "name": "Iceland",
                "iso_code": "IS"
            },
            {
                "country_id": "1101",
                "name": "India",
                "iso_code": "IN"
            },
            {
                "country_id": "1102",
                "name": "Indonesia",
                "iso_code": "ID"
            },
            {
                "country_id": "1103",
                "name": "Iran, Islamic Republic of",
                "iso_code": "IR"
            },
            {
                "country_id": "1104",
                "name": "Iraq",
                "iso_code": "IQ"
            },
            {
                "country_id": "1105",
                "name": "Ireland",
                "iso_code": "IE"
            },
            {
                "country_id": "1106",
                "name": "Israel",
                "iso_code": "IL"
            },
            {
                "country_id": "1107",
                "name": "Italy",
                "iso_code": "IT"
            },
            {
                "country_id": "1108",
                "name": "Jamaica",
                "iso_code": "JM"
            },
            {
                "country_id": "1109",
                "name": "Japan",
                "iso_code": "JP"
            },
            {
                "country_id": "1110",
                "name": "Jordan",
                "iso_code": "JO"
            },
            {
                "country_id": "1111",
                "name": "Kazakhstan",
                "iso_code": "KZ"
            },
            {
                "country_id": "1112",
                "name": "Kenya",
                "iso_code": "KE"
            },
            {
                "country_id": "1113",
                "name": "Kiribati",
                "iso_code": "KI"
            },
            {
                "country_id": "1114",
                "name": "Korea, Democratic People's Republic of",
                "iso_code": "KP"
            },
            {
                "country_id": "1115",
                "name": "Korea, Republic of",
                "iso_code": "KR"
            },
            {
                "country_id": "1116",
                "name": "Kuwait",
                "iso_code": "KW"
            },
            {
                "country_id": "1117",
                "name": "Kyrgyzstan",
                "iso_code": "KG"
            },
            {
                "country_id": "1118",
                "name": "Lao People's Democratic Republic",
                "iso_code": "LA"
            },
            {
                "country_id": "1119",
                "name": "Latvia",
                "iso_code": "LV"
            },
            {
                "country_id": "1120",
                "name": "Lebanon",
                "iso_code": "LB"
            },
            {
                "country_id": "1121",
                "name": "Lesotho",
                "iso_code": "LS"
            },
            {
                "country_id": "1122",
                "name": "Liberia",
                "iso_code": "LR"
            },
            {
                "country_id": "1123",
                "name": "Libyan Arab Jamahiriya",
                "iso_code": "LY"
            },
            {
                "country_id": "1124",
                "name": "Liechtenstein",
                "iso_code": "LI"
            },
            {
                "country_id": "1125",
                "name": "Lithuania",
                "iso_code": "LT"
            },
            {
                "country_id": "1126",
                "name": "Luxembourg",
                "iso_code": "LU"
            },
            {
                "country_id": "1127",
                "name": "Macao",
                "iso_code": "MO"
            },
            {
                "country_id": "1128",
                "name": "Macedonia, Republic of",
                "iso_code": "MK"
            },
            {
                "country_id": "1129",
                "name": "Madagascar",
                "iso_code": "MG"
            },
            {
                "country_id": "1130",
                "name": "Malawi",
                "iso_code": "MW"
            },
            {
                "country_id": "1131",
                "name": "Malaysia",
                "iso_code": "MY"
            },
            {
                "country_id": "1132",
                "name": "Maldives",
                "iso_code": "MV"
            },
            {
                "country_id": "1133",
                "name": "Mali",
                "iso_code": "ML"
            },
            {
                "country_id": "1134",
                "name": "Malta",
                "iso_code": "MT"
            },
            {
                "country_id": "1135",
                "name": "Marshall Islands",
                "iso_code": "MH"
            },
            {
                "country_id": "1136",
                "name": "Martinique",
                "iso_code": "MQ"
            },
            {
                "country_id": "1137",
                "name": "Mauritania",
                "iso_code": "MR"
            },
            {
                "country_id": "1138",
                "name": "Mauritius",
                "iso_code": "MU"
            },
            {
                "country_id": "1139",
                "name": "Mayotte",
                "iso_code": "YT"
            },
            {
                "country_id": "1140",
                "name": "Mexico",
                "iso_code": "MX"
            },
            {
                "country_id": "1141",
                "name": "Micronesia, Federated States of",
                "iso_code": "FM"
            },
            {
                "country_id": "1142",
                "name": "Moldova",
                "iso_code": "MD"
            },
            {
                "country_id": "1143",
                "name": "Monaco",
                "iso_code": "MC"
            },
            {
                "country_id": "1144",
                "name": "Mongolia",
                "iso_code": "MN"
            },
            {
                "country_id": "1145",
                "name": "Montserrat",
                "iso_code": "MS"
            },
            {
                "country_id": "1146",
                "name": "Morocco",
                "iso_code": "MA"
            },
            {
                "country_id": "1147",
                "name": "Mozambique",
                "iso_code": "MZ"
            },
            {
                "country_id": "1148",
                "name": "Namibia",
                "iso_code": "NA"
            },
            {
                "country_id": "1149",
                "name": "Nauru",
                "iso_code": "NR"
            },
            {
                "country_id": "1150",
                "name": "Nepal",
                "iso_code": "NP"
            },
            {
                "country_id": "1151",
                "name": "Netherlands Antilles",
                "iso_code": "AN"
            },
            {
                "country_id": "1152",
                "name": "Netherlands",
                "iso_code": "NL"
            },
            {
                "country_id": "1153",
                "name": "New Caledonia",
                "iso_code": "NC"
            },
            {
                "country_id": "1154",
                "name": "New Zealand",
                "iso_code": "NZ"
            },
            {
                "country_id": "1155",
                "name": "Nicaragua",
                "iso_code": "NI"
            },
            {
                "country_id": "1156",
                "name": "Niger",
                "iso_code": "NE"
            },
            {
                "country_id": "1157",
                "name": "Nigeria",
                "iso_code": "NG"
            },
            {
                "country_id": "1158",
                "name": "Niue",
                "iso_code": "NU"
            },
            {
                "country_id": "1159",
                "name": "Norfolk Island",
                "iso_code": "NF"
            },
            {
                "country_id": "1160",
                "name": "Northern Mariana Islands",
                "iso_code": "MP"
            },
            {
                "country_id": "1161",
                "name": "Norway",
                "iso_code": "NO"
            },
            {
                "country_id": "1162",
                "name": "Oman",
                "iso_code": "OM"
            },
            {
                "country_id": "1163",
                "name": "Pakistan",
                "iso_code": "PK"
            },
            {
                "country_id": "1164",
                "name": "Palau",
                "iso_code": "PW"
            },
            {
                "country_id": "1165",
                "name": "Palestinian Territory, Occupied",
                "iso_code": "PS"
            },
            {
                "country_id": "1166",
                "name": "Panama",
                "iso_code": "PA"
            },
            {
                "country_id": "1167",
                "name": "Papua New Guinea",
                "iso_code": "PG"
            },
            {
                "country_id": "1168",
                "name": "Paraguay",
                "iso_code": "PY"
            },
            {
                "country_id": "1169",
                "name": "Peru",
                "iso_code": "PE"
            },
            {
                "country_id": "1170",
                "name": "Philippines",
                "iso_code": "PH"
            },
            {
                "country_id": "1171",
                "name": "Pitcairn",
                "iso_code": "PN"
            },
            {
                "country_id": "1172",
                "name": "Poland",
                "iso_code": "PL"
            },
            {
                "country_id": "1173",
                "name": "Portugal",
                "iso_code": "PT"
            },
            {
                "country_id": "1174",
                "name": "Puerto Rico",
                "iso_code": "PR"
            },
            {
                "country_id": "1175",
                "name": "Qatar",
                "iso_code": "QA"
            },
            {
                "country_id": "1176",
                "name": "Romania",
                "iso_code": "RO"
            },
            {
                "country_id": "1177",
                "name": "Russian Federation",
                "iso_code": "RU"
            },
            {
                "country_id": "1178",
                "name": "Rwanda",
                "iso_code": "RW"
            },
            {
                "country_id": "1179",
                "name": "Reunion",
                "iso_code": "RE"
            },
            {
                "country_id": "1180",
                "name": "Saint Helena",
                "iso_code": "SH"
            },
            {
                "country_id": "1181",
                "name": "Saint Kitts and Nevis",
                "iso_code": "KN"
            },
            {
                "country_id": "1182",
                "name": "Saint Lucia",
                "iso_code": "LC"
            },
            {
                "country_id": "1183",
                "name": "Saint Pierre and Miquelon",
                "iso_code": "PM"
            },
            {
                "country_id": "1184",
                "name": "Saint Vincent and the Grenadines",
                "iso_code": "VC"
            },
            {
                "country_id": "1185",
                "name": "Samoa",
                "iso_code": "WS"
            },
            {
                "country_id": "1186",
                "name": "San Marino",
                "iso_code": "SM"
            },
            {
                "country_id": "1187",
                "name": "Saudi Arabia",
                "iso_code": "SA"
            },
            {
                "country_id": "1188",
                "name": "Senegal",
                "iso_code": "SN"
            },
            {
                "country_id": "1189",
                "name": "Seychelles",
                "iso_code": "SC"
            },
            {
                "country_id": "1190",
                "name": "Sierra Leone",
                "iso_code": "SL"
            },
            {
                "country_id": "1191",
                "name": "Singapore",
                "iso_code": "SG"
            },
            {
                "country_id": "1192",
                "name": "Slovakia",
                "iso_code": "SK"
            },
            {
                "country_id": "1193",
                "name": "Slovenia",
                "iso_code": "SI"
            },
            {
                "country_id": "1194",
                "name": "Solomon Islands",
                "iso_code": "SB"
            },
            {
                "country_id": "1195",
                "name": "Somalia",
                "iso_code": "SO"
            },
            {
                "country_id": "1196",
                "name": "South Africa",
                "iso_code": "ZA"
            },
            {
                "country_id": "1197",
                "name": "South Georgia and the South Sandwich Islands",
                "iso_code": "GS"
            },
            {
                "country_id": "1198",
                "name": "Spain",
                "iso_code": "ES"
            },
            {
                "country_id": "1199",
                "name": "Sri Lanka",
                "iso_code": "LK"
            },
            {
                "country_id": "1200",
                "name": "Sudan",
                "iso_code": "SD"
            },
            {
                "country_id": "1201",
                "name": "Suriname",
                "iso_code": "SR"
            },
            {
                "country_id": "1202",
                "name": "Svalbard and Jan Mayen",
                "iso_code": "SJ"
            },
            {
                "country_id": "1203",
                "name": "Swaziland",
                "iso_code": "SZ"
            },
            {
                "country_id": "1204",
                "name": "Sweden",
                "iso_code": "SE"
            },
            {
                "country_id": "1205",
                "name": "Switzerland",
                "iso_code": "CH"
            },
            {
                "country_id": "1206",
                "name": "Syrian Arab Republic",
                "iso_code": "SY"
            },
            {
                "country_id": "1207",
                "name": "Sao Tome and Principe",
                "iso_code": "ST"
            },
            {
                "country_id": "1208",
                "name": "Taiwan",
                "iso_code": "TW"
            },
            {
                "country_id": "1209",
                "name": "Tajikistan",
                "iso_code": "TJ"
            },
            {
                "country_id": "1210",
                "name": "Tanzania, United Republic of",
                "iso_code": "TZ"
            },
            {
                "country_id": "1211",
                "name": "Thailand",
                "iso_code": "TH"
            },
            {
                "country_id": "1212",
                "name": "Bahamas",
                "iso_code": "BS"
            },
            {
                "country_id": "1213",
                "name": "Gambia",
                "iso_code": "GM"
            },
            {
                "country_id": "1214",
                "name": "Togo",
                "iso_code": "TG"
            },
            {
                "country_id": "1215",
                "name": "Tokelau",
                "iso_code": "TK"
            },
            {
                "country_id": "1216",
                "name": "Tonga",
                "iso_code": "TO"
            },
            {
                "country_id": "1217",
                "name": "Trinidad and Tobago",
                "iso_code": "TT"
            },
            {
                "country_id": "1218",
                "name": "Tunisia",
                "iso_code": "TN"
            },
            {
                "country_id": "1219",
                "name": "Turkey",
                "iso_code": "TR"
            },
            {
                "country_id": "1220",
                "name": "Turkmenistan",
                "iso_code": "TM"
            },
            {
                "country_id": "1221",
                "name": "Turks and Caicos Islands",
                "iso_code": "TC"
            },
            {
                "country_id": "1222",
                "name": "Tuvalu",
                "iso_code": "TV"
            },
            {
                "country_id": "1223",
                "name": "Uganda",
                "iso_code": "UG"
            },
            {
                "country_id": "1224",
                "name": "Ukraine",
                "iso_code": "UA"
            },
            {
                "country_id": "1225",
                "name": "United Arab Emirates",
                "iso_code": "AE"
            },
            {
                "country_id": "1226",
                "name": "United Kingdom",
                "iso_code": "GB"
            },
            {
                "country_id": "1227",
                "name": "United States Minor Outlying Islands",
                "iso_code": "UM"
            },
            {
                "country_id": "1228",
                "name": "United States",
                "iso_code": "US"
            },
            {
                "country_id": "1229",
                "name": "Uruguay",
                "iso_code": "UY"
            },
            {
                "country_id": "1230",
                "name": "Uzbekistan",
                "iso_code": "UZ"
            },
            {
                "country_id": "1231",
                "name": "Vanuatu",
                "iso_code": "VU"
            },
            {
                "country_id": "1232",
                "name": "Venezuela",
                "iso_code": "VE"
            },
            {
                "country_id": "1233",
                "name": "Viet Nam",
                "iso_code": "VN"
            },
            {
                "country_id": "1234",
                "name": "Virgin Islands, U.S.",
                "iso_code": "VI"
            },
            {
                "country_id": "1235",
                "name": "Wallis and Futuna",
                "iso_code": "WF"
            },
            {
                "country_id": "1236",
                "name": "Western Sahara",
                "iso_code": "EH"
            },
            {
                "country_id": "1237",
                "name": "Yemen",
                "iso_code": "YE"
            },
            {
                "country_id": "1238",
                "name": "Serbia and Montenegro",
                "iso_code": "CS"
            },
            {
                "country_id": "1239",
                "name": "Zambia",
                "iso_code": "ZM"
            },
            {
                "country_id": "1240",
                "name": "Zimbabwe",
                "iso_code": "ZW"
            },
            {
                "country_id": "1241",
                "name": "Åland Islands",
                "iso_code": "AX"
            },
            {
                "country_id": "1242",
                "name": "Serbia",
                "iso_code": "RS"
            },
            {
                "country_id": "1243",
                "name": "Montenegro",
                "iso_code": "ME"
            },
            {
                "country_id": "1244",
                "name": "Jersey",
                "iso_code": "JE"
            },
            {
                "country_id": "1245",
                "name": "Guernsey",
                "iso_code": "GG"
            },
            {
                "country_id": "1246",
                "name": "Isle of Man",
                "iso_code": "IM"
            }
        ],
        "states": {
            "1001": [
                {
                    "name": "Badakhshan",
                    "abbreviation": "BDS"
                },
                {
                    "name": "Badghis",
                    "abbreviation": "BDG"
                },
                {
                    "name": "Baghlan",
                    "abbreviation": "BGL"
                },
                {
                    "name": "Balkh",
                    "abbreviation": "BAL"
                },
                {
                    "name": "Bamian",
                    "abbreviation": "BAM"
                },
                {
                    "name": "Farah",
                    "abbreviation": "FRA"
                },
                {
                    "name": "Faryab",
                    "abbreviation": "FYB"
                },
                {
                    "name": "Ghazni",
                    "abbreviation": "GHA"
                },
                {
                    "name": "Ghowr",
                    "abbreviation": "GHO"
                },
                {
                    "name": "Helmand",
                    "abbreviation": "HEL"
                },
                {
                    "name": "Herat",
                    "abbreviation": "HER"
                },
                {
                    "name": "Jowzjan",
                    "abbreviation": "JOW"
                },
                {
                    "name": "Kabul",
                    "abbreviation": "KAB"
                },
                {
                    "name": "Kandahar",
                    "abbreviation": "KAN"
                },
                {
                    "name": "Kapisa",
                    "abbreviation": "KAP"
                },
                {
                    "name": "Khowst",
                    "abbreviation": "KHO"
                },
                {
                    "name": "Konar",
                    "abbreviation": "KNR"
                },
                {
                    "name": "Kondoz",
                    "abbreviation": "KDZ"
                },
                {
                    "name": "Laghman",
                    "abbreviation": "LAG"
                },
                {
                    "name": "Lowgar",
                    "abbreviation": "LOW"
                },
                {
                    "name": "Nangrahar",
                    "abbreviation": "NAN"
                },
                {
                    "name": "Nimruz",
                    "abbreviation": "NIM"
                },
                {
                    "name": "Nurestan",
                    "abbreviation": "NUR"
                },
                {
                    "name": "Oruzgan",
                    "abbreviation": "ORU"
                },
                {
                    "name": "Paktia",
                    "abbreviation": "PIA"
                },
                {
                    "name": "Paktika",
                    "abbreviation": "PKA"
                },
                {
                    "name": "Parwan",
                    "abbreviation": "PAR"
                },
                {
                    "name": "Samangan",
                    "abbreviation": "SAM"
                },
                {
                    "name": "Sar-e Pol",
                    "abbreviation": "SAR"
                },
                {
                    "name": "Takhar",
                    "abbreviation": "TAK"
                },
                {
                    "name": "Wardak",
                    "abbreviation": "WAR"
                },
                {
                    "name": "Zabol",
                    "abbreviation": "ZAB"
                }
            ],
            "1002": [
                {
                    "name": "Berat",
                    "abbreviation": "BR"
                },
                {
                    "name": "Bulqizë",
                    "abbreviation": "BU"
                },
                {
                    "name": "Delvinë",
                    "abbreviation": "DL"
                },
                {
                    "name": "Devoll",
                    "abbreviation": "DV"
                },
                {
                    "name": "Dibër",
                    "abbreviation": "DI"
                },
                {
                    "name": "Durrsës",
                    "abbreviation": "DR"
                },
                {
                    "name": "Elbasan",
                    "abbreviation": "EL"
                },
                {
                    "name": "Fier",
                    "abbreviation": "FR"
                },
                {
                    "name": "Gramsh",
                    "abbreviation": "GR"
                },
                {
                    "name": "Gjirokastër",
                    "abbreviation": "GJ"
                },
                {
                    "name": "Has",
                    "abbreviation": "HA"
                },
                {
                    "name": "Kavajë",
                    "abbreviation": "KA"
                },
                {
                    "name": "Kolonjë",
                    "abbreviation": "ER"
                },
                {
                    "name": "Korcë",
                    "abbreviation": "KO"
                },
                {
                    "name": "Krujë",
                    "abbreviation": "KR"
                },
                {
                    "name": "Kuçovë",
                    "abbreviation": "KC"
                },
                {
                    "name": "Kukës",
                    "abbreviation": "KU"
                },
                {
                    "name": "Kurbin",
                    "abbreviation": "KB"
                },
                {
                    "name": "Lezhë",
                    "abbreviation": "LE"
                },
                {
                    "name": "Librazhd",
                    "abbreviation": "LB"
                },
                {
                    "name": "Lushnjë",
                    "abbreviation": "LU"
                },
                {
                    "name": "Malësi e Madhe",
                    "abbreviation": "MM"
                },
                {
                    "name": "Mallakastër",
                    "abbreviation": "MK"
                },
                {
                    "name": "Mat",
                    "abbreviation": "MT"
                },
                {
                    "name": "Mirditë",
                    "abbreviation": "MR"
                },
                {
                    "name": "Peqin",
                    "abbreviation": "PQ"
                },
                {
                    "name": "Përmet",
                    "abbreviation": "PR"
                },
                {
                    "name": "Pogradec",
                    "abbreviation": "PG"
                },
                {
                    "name": "Pukë",
                    "abbreviation": "PU"
                },
                {
                    "name": "Sarandë",
                    "abbreviation": "SR"
                },
                {
                    "name": "Skrapar",
                    "abbreviation": "SK"
                },
                {
                    "name": "Shkodër",
                    "abbreviation": "SH"
                },
                {
                    "name": "Tepelenë",
                    "abbreviation": "TE"
                },
                {
                    "name": "Tiranë",
                    "abbreviation": "TR"
                },
                {
                    "name": "Tropojë",
                    "abbreviation": "TP"
                },
                {
                    "name": "Vlorë",
                    "abbreviation": "VL"
                }
            ],
            "1003": [
                {
                    "name": "Adrar",
                    "abbreviation": "01"
                },
                {
                    "name": "Ain Defla",
                    "abbreviation": "44"
                },
                {
                    "name": "Ain Tmouchent",
                    "abbreviation": "46"
                },
                {
                    "name": "Alger",
                    "abbreviation": "16"
                },
                {
                    "name": "Annaba",
                    "abbreviation": "23"
                },
                {
                    "name": "Batna",
                    "abbreviation": "05"
                },
                {
                    "name": "Bechar",
                    "abbreviation": "08"
                },
                {
                    "name": "Bejaia",
                    "abbreviation": "06"
                },
                {
                    "name": "Biskra",
                    "abbreviation": "07"
                },
                {
                    "name": "Blida",
                    "abbreviation": "09"
                },
                {
                    "name": "Bordj Bou Arreridj",
                    "abbreviation": "34"
                },
                {
                    "name": "Bouira",
                    "abbreviation": "10"
                },
                {
                    "name": "Boumerdes",
                    "abbreviation": "35"
                },
                {
                    "name": "Chlef",
                    "abbreviation": "02"
                },
                {
                    "name": "Constantine",
                    "abbreviation": "25"
                },
                {
                    "name": "Djelfa",
                    "abbreviation": "17"
                },
                {
                    "name": "El Bayadh",
                    "abbreviation": "32"
                },
                {
                    "name": "El Oued",
                    "abbreviation": "39"
                },
                {
                    "name": "El Tarf",
                    "abbreviation": "36"
                },
                {
                    "name": "Ghardaia",
                    "abbreviation": "47"
                },
                {
                    "name": "Guelma",
                    "abbreviation": "24"
                },
                {
                    "name": "Illizi",
                    "abbreviation": "33"
                },
                {
                    "name": "Jijel",
                    "abbreviation": "18"
                },
                {
                    "name": "Khenchela",
                    "abbreviation": "40"
                },
                {
                    "name": "Laghouat",
                    "abbreviation": "03"
                },
                {
                    "name": "Mascara",
                    "abbreviation": "29"
                },
                {
                    "name": "Medea",
                    "abbreviation": "26"
                },
                {
                    "name": "Mila",
                    "abbreviation": "43"
                },
                {
                    "name": "Mostaganem",
                    "abbreviation": "27"
                },
                {
                    "name": "Msila",
                    "abbreviation": "28"
                },
                {
                    "name": "Naama",
                    "abbreviation": "45"
                },
                {
                    "name": "Oran",
                    "abbreviation": "31"
                },
                {
                    "name": "Ouargla",
                    "abbreviation": "30"
                },
                {
                    "name": "Oum el Bouaghi",
                    "abbreviation": "04"
                },
                {
                    "name": "Relizane",
                    "abbreviation": "48"
                },
                {
                    "name": "Saida",
                    "abbreviation": "20"
                },
                {
                    "name": "Setif",
                    "abbreviation": "19"
                },
                {
                    "name": "Sidi Bel Abbes",
                    "abbreviation": "22"
                },
                {
                    "name": "Skikda",
                    "abbreviation": "21"
                },
                {
                    "name": "Souk Ahras",
                    "abbreviation": "41"
                },
                {
                    "name": "Tamanghasset",
                    "abbreviation": "11"
                },
                {
                    "name": "Tebessa",
                    "abbreviation": "12"
                },
                {
                    "name": "Tiaret",
                    "abbreviation": "14"
                },
                {
                    "name": "Tindouf",
                    "abbreviation": "37"
                },
                {
                    "name": "Tipaza",
                    "abbreviation": "42"
                },
                {
                    "name": "Tissemsilt",
                    "abbreviation": "38"
                },
                {
                    "name": "Tizi Ouzou",
                    "abbreviation": "15"
                },
                {
                    "name": "Tlemcen",
                    "abbreviation": "13"
                }
            ],
            "1006": [
                {
                    "name": "Bengo",
                    "abbreviation": "BGO"
                },
                {
                    "name": "Benguela",
                    "abbreviation": "BGU"
                },
                {
                    "name": "Bie",
                    "abbreviation": "BIE"
                },
                {
                    "name": "Cabinda",
                    "abbreviation": "CAB"
                },
                {
                    "name": "Cuando-Cubango",
                    "abbreviation": "CCU"
                },
                {
                    "name": "Cuanza Norte",
                    "abbreviation": "CNO"
                },
                {
                    "name": "Cuanza Sul",
                    "abbreviation": "CUS"
                },
                {
                    "name": "Cunene",
                    "abbreviation": "CNN"
                },
                {
                    "name": "Huambo",
                    "abbreviation": "HUA"
                },
                {
                    "name": "Huila",
                    "abbreviation": "HUI"
                },
                {
                    "name": "Luanda",
                    "abbreviation": "LUA"
                },
                {
                    "name": "Lunda Norte",
                    "abbreviation": "LNO"
                },
                {
                    "name": "Lunda Sul",
                    "abbreviation": "LSU"
                },
                {
                    "name": "Malange",
                    "abbreviation": "MAL"
                },
                {
                    "name": "Moxico",
                    "abbreviation": "MOX"
                },
                {
                    "name": "Namibe",
                    "abbreviation": "NAM"
                },
                {
                    "name": "Uige",
                    "abbreviation": "UIG"
                },
                {
                    "name": "Zaire",
                    "abbreviation": "ZAI"
                }
            ],
            "1008": [
                {
                    "name": "Australian Antarctic Territory",
                    "abbreviation": "AAT"
                }
            ],
            "1010": [
                {
                    "name": "Capital federal",
                    "abbreviation": "C"
                },
                {
                    "name": "Buenos Aires",
                    "abbreviation": "B"
                },
                {
                    "name": "Catamarca",
                    "abbreviation": "K"
                },
                {
                    "name": "Cordoba",
                    "abbreviation": "X"
                },
                {
                    "name": "Corrientes",
                    "abbreviation": "W"
                },
                {
                    "name": "Chaco",
                    "abbreviation": "H"
                },
                {
                    "name": "Chubut",
                    "abbreviation": "U"
                },
                {
                    "name": "Entre Rios",
                    "abbreviation": "E"
                },
                {
                    "name": "Formosa",
                    "abbreviation": "P"
                },
                {
                    "name": "Jujuy",
                    "abbreviation": "Y"
                },
                {
                    "name": "La Pampa",
                    "abbreviation": "L"
                },
                {
                    "name": "Mendoza",
                    "abbreviation": "M"
                },
                {
                    "name": "Misiones",
                    "abbreviation": "N"
                },
                {
                    "name": "Neuquen",
                    "abbreviation": "Q"
                },
                {
                    "name": "Rio Negro",
                    "abbreviation": "R"
                },
                {
                    "name": "Salta",
                    "abbreviation": "A"
                },
                {
                    "name": "San Juan",
                    "abbreviation": "J"
                },
                {
                    "name": "San Luis",
                    "abbreviation": "D"
                },
                {
                    "name": "Santa Cruz",
                    "abbreviation": "Z"
                },
                {
                    "name": "Santa Fe",
                    "abbreviation": "S"
                },
                {
                    "name": "Santiago del Estero",
                    "abbreviation": "G"
                },
                {
                    "name": "Tierra del Fuego",
                    "abbreviation": "V"
                },
                {
                    "name": "Tucuman",
                    "abbreviation": "T"
                }
            ],
            "1011": [
                {
                    "name": "Erevan",
                    "abbreviation": "ER"
                },
                {
                    "name": "Aragacotn",
                    "abbreviation": "AG"
                },
                {
                    "name": "Ararat",
                    "abbreviation": "AR"
                },
                {
                    "name": "Armavir",
                    "abbreviation": "AV"
                },
                {
                    "name": "Gegarkunik'",
                    "abbreviation": "GR"
                },
                {
                    "name": "Kotayk'",
                    "abbreviation": "KT"
                },
                {
                    "name": "Lory",
                    "abbreviation": "LO"
                },
                {
                    "name": "Sirak",
                    "abbreviation": "SH"
                },
                {
                    "name": "Syunik'",
                    "abbreviation": "SU"
                },
                {
                    "name": "Tavus",
                    "abbreviation": "TV"
                },
                {
                    "name": "Vayoc Jor",
                    "abbreviation": "VD"
                }
            ],
            "1013": [
                {
                    "name": "Australian Capital Territory",
                    "abbreviation": "ACT"
                },
                {
                    "name": "Northern Territory",
                    "abbreviation": "NT"
                },
                {
                    "name": "New South Wales",
                    "abbreviation": "NSW"
                },
                {
                    "name": "Queensland",
                    "abbreviation": "QLD"
                },
                {
                    "name": "South Australia",
                    "abbreviation": "SA"
                },
                {
                    "name": "Tasmania",
                    "abbreviation": "TAS"
                },
                {
                    "name": "Victoria",
                    "abbreviation": "VIC"
                },
                {
                    "name": "Western Australia",
                    "abbreviation": "WA"
                }
            ],
            "1014": [
                {
                    "name": "Burgenland",
                    "abbreviation": "1"
                },
                {
                    "name": "Kärnten",
                    "abbreviation": "2"
                },
                {
                    "name": "Niederosterreich",
                    "abbreviation": "3"
                },
                {
                    "name": "Oberosterreich",
                    "abbreviation": "4"
                },
                {
                    "name": "Salzburg",
                    "abbreviation": "5"
                },
                {
                    "name": "Steiermark",
                    "abbreviation": "6"
                },
                {
                    "name": "Tirol",
                    "abbreviation": "7"
                },
                {
                    "name": "Vorarlberg",
                    "abbreviation": "8"
                },
                {
                    "name": "Wien",
                    "abbreviation": "9"
                }
            ],
            "1015": [
                {
                    "name": "Naxcivan",
                    "abbreviation": "NX"
                },
                {
                    "name": "Ali Bayramli",
                    "abbreviation": "AB"
                },
                {
                    "name": "Baki",
                    "abbreviation": "BA"
                },
                {
                    "name": "Ganca",
                    "abbreviation": "GA"
                },
                {
                    "name": "Lankaran",
                    "abbreviation": "LA"
                },
                {
                    "name": "Mingacevir",
                    "abbreviation": "MI"
                },
                {
                    "name": "Naftalan",
                    "abbreviation": "NA"
                },
                {
                    "name": "Saki",
                    "abbreviation": "SA"
                },
                {
                    "name": "Sumqayit",
                    "abbreviation": "SM"
                },
                {
                    "name": "Susa",
                    "abbreviation": "SS"
                },
                {
                    "name": "Xankandi",
                    "abbreviation": "XA"
                },
                {
                    "name": "Yevlax",
                    "abbreviation": "YE"
                },
                {
                    "name": "Abseron",
                    "abbreviation": "ABS"
                },
                {
                    "name": "Agcabadi",
                    "abbreviation": "AGC"
                },
                {
                    "name": "Agdam",
                    "abbreviation": "AGM"
                },
                {
                    "name": "Agdas",
                    "abbreviation": "AGS"
                },
                {
                    "name": "Agstafa",
                    "abbreviation": "AGA"
                },
                {
                    "name": "Agsu",
                    "abbreviation": "AGU"
                },
                {
                    "name": "Astara",
                    "abbreviation": "AST"
                },
                {
                    "name": "Babak",
                    "abbreviation": "BAB"
                },
                {
                    "name": "Balakan",
                    "abbreviation": "BAL"
                },
                {
                    "name": "Barda",
                    "abbreviation": "BAR"
                },
                {
                    "name": "Beylagan",
                    "abbreviation": "BEY"
                },
                {
                    "name": "Bilasuvar",
                    "abbreviation": "BIL"
                },
                {
                    "name": "Cabrayll",
                    "abbreviation": "CAB"
                },
                {
                    "name": "Calilabad",
                    "abbreviation": "CAL"
                },
                {
                    "name": "Culfa",
                    "abbreviation": "CUL"
                },
                {
                    "name": "Daskasan",
                    "abbreviation": "DAS"
                },
                {
                    "name": "Davaci",
                    "abbreviation": "DAV"
                },
                {
                    "name": "Fuzuli",
                    "abbreviation": "FUZ"
                },
                {
                    "name": "Gadabay",
                    "abbreviation": "GAD"
                },
                {
                    "name": "Goranboy",
                    "abbreviation": "GOR"
                },
                {
                    "name": "Goycay",
                    "abbreviation": "GOY"
                },
                {
                    "name": "Haciqabul",
                    "abbreviation": "HAC"
                },
                {
                    "name": "Imisli",
                    "abbreviation": "IMI"
                },
                {
                    "name": "Ismayilli",
                    "abbreviation": "ISM"
                },
                {
                    "name": "Kalbacar",
                    "abbreviation": "KAL"
                },
                {
                    "name": "Kurdamir",
                    "abbreviation": "KUR"
                },
                {
                    "name": "Lacin",
                    "abbreviation": "LAC"
                },
                {
                    "name": "Lerik",
                    "abbreviation": "LER"
                },
                {
                    "name": "Masalli",
                    "abbreviation": "MAS"
                },
                {
                    "name": "Neftcala",
                    "abbreviation": "NEF"
                },
                {
                    "name": "Oguz",
                    "abbreviation": "OGU"
                },
                {
                    "name": "Ordubad",
                    "abbreviation": "ORD"
                },
                {
                    "name": "Qabala",
                    "abbreviation": "QAB"
                },
                {
                    "name": "Qax",
                    "abbreviation": "QAX"
                },
                {
                    "name": "Qazax",
                    "abbreviation": "QAZ"
                },
                {
                    "name": "Qobustan",
                    "abbreviation": "QOB"
                },
                {
                    "name": "Quba",
                    "abbreviation": "QBA"
                },
                {
                    "name": "Qubadli",
                    "abbreviation": "QBI"
                },
                {
                    "name": "Qusar",
                    "abbreviation": "QUS"
                },
                {
                    "name": "Saatli",
                    "abbreviation": "SAT"
                },
                {
                    "name": "Sabirabad",
                    "abbreviation": "SAB"
                },
                {
                    "name": "Sadarak",
                    "abbreviation": "SAD"
                },
                {
                    "name": "Sahbuz",
                    "abbreviation": "SAH"
                },
                {
                    "name": "Salyan",
                    "abbreviation": "SAL"
                },
                {
                    "name": "Samaxi",
                    "abbreviation": "SMI"
                },
                {
                    "name": "Samkir",
                    "abbreviation": "SKR"
                },
                {
                    "name": "Samux",
                    "abbreviation": "SMX"
                },
                {
                    "name": "Sarur",
                    "abbreviation": "SAR"
                },
                {
                    "name": "Siyazan",
                    "abbreviation": "SIY"
                },
                {
                    "name": "Tartar",
                    "abbreviation": "TAR"
                },
                {
                    "name": "Tovuz",
                    "abbreviation": "TOV"
                },
                {
                    "name": "Ucar",
                    "abbreviation": "UCA"
                },
                {
                    "name": "Xacmaz",
                    "abbreviation": "XAC"
                },
                {
                    "name": "Xanlar",
                    "abbreviation": "XAN"
                },
                {
                    "name": "Xizi",
                    "abbreviation": "XIZ"
                },
                {
                    "name": "Xocali",
                    "abbreviation": "XCI"
                },
                {
                    "name": "Xocavand",
                    "abbreviation": "XVD"
                },
                {
                    "name": "Yardimli",
                    "abbreviation": "YAR"
                },
                {
                    "name": "Zangilan",
                    "abbreviation": "ZAN"
                },
                {
                    "name": "Zaqatala",
                    "abbreviation": "ZAQ"
                },
                {
                    "name": "Zardab",
                    "abbreviation": "ZAR"
                }
            ],
            "1016": [
                {
                    "name": "Al Hadd",
                    "abbreviation": "01"
                },
                {
                    "name": "Al Manamah",
                    "abbreviation": "03"
                },
                {
                    "name": "Al Mintaqah al Gharbiyah",
                    "abbreviation": "10"
                },
                {
                    "name": "Al Mintagah al Wusta",
                    "abbreviation": "07"
                },
                {
                    "name": "Al Mintaqah ash Shamaliyah",
                    "abbreviation": "05"
                },
                {
                    "name": "Al Muharraq",
                    "abbreviation": "02"
                },
                {
                    "name": "Ar Rifa",
                    "abbreviation": "09"
                },
                {
                    "name": "Jidd Hafs",
                    "abbreviation": "04"
                },
                {
                    "name": "Madluat Jamad",
                    "abbreviation": "12"
                },
                {
                    "name": "Madluat Isa",
                    "abbreviation": "08"
                },
                {
                    "name": "Mintaqat Juzur tawar",
                    "abbreviation": "11"
                },
                {
                    "name": "Sitrah",
                    "abbreviation": "06"
                },
                {
                    "name": "Al Manāmah (Al ‘Āşimah)",
                    "abbreviation": "13"
                },
                {
                    "name": "Al Janūbīyah",
                    "abbreviation": "14"
                },
                {
                    "name": "Al Wusţá",
                    "abbreviation": "16"
                },
                {
                    "name": "Ash Shamālīyah",
                    "abbreviation": "17"
                }
            ],
            "1017": [
                {
                    "name": "Bagerhat zila",
                    "abbreviation": "05"
                },
                {
                    "name": "Bandarban zila",
                    "abbreviation": "01"
                },
                {
                    "name": "Barguna zila",
                    "abbreviation": "02"
                },
                {
                    "name": "Barisal zila",
                    "abbreviation": "06"
                },
                {
                    "name": "Bhola zila",
                    "abbreviation": "07"
                },
                {
                    "name": "Bogra zila",
                    "abbreviation": "03"
                },
                {
                    "name": "Brahmanbaria zila",
                    "abbreviation": "04"
                },
                {
                    "name": "Chandpur zila",
                    "abbreviation": "09"
                },
                {
                    "name": "Chittagong zila",
                    "abbreviation": "10"
                },
                {
                    "name": "Chuadanga zila",
                    "abbreviation": "12"
                },
                {
                    "name": "Comilla zila",
                    "abbreviation": "08"
                },
                {
                    "name": "Cox's Bazar zila",
                    "abbreviation": "11"
                },
                {
                    "name": "Dhaka zila",
                    "abbreviation": "13"
                },
                {
                    "name": "Dinajpur zila",
                    "abbreviation": "14"
                },
                {
                    "name": "Faridpur zila",
                    "abbreviation": "15"
                },
                {
                    "name": "Feni zila",
                    "abbreviation": "16"
                },
                {
                    "name": "Gaibandha zila",
                    "abbreviation": "19"
                },
                {
                    "name": "Gazipur zila",
                    "abbreviation": "18"
                },
                {
                    "name": "Gopalganj zila",
                    "abbreviation": "17"
                },
                {
                    "name": "Habiganj zila",
                    "abbreviation": "20"
                },
                {
                    "name": "Jaipurhat zila",
                    "abbreviation": "24"
                },
                {
                    "name": "Jamalpur zila",
                    "abbreviation": "21"
                },
                {
                    "name": "Jessore zila",
                    "abbreviation": "22"
                },
                {
                    "name": "Jhalakati zila",
                    "abbreviation": "25"
                },
                {
                    "name": "Jhenaidah zila",
                    "abbreviation": "23"
                },
                {
                    "name": "Khagrachari zila",
                    "abbreviation": "29"
                },
                {
                    "name": "Khulna zila",
                    "abbreviation": "27"
                },
                {
                    "name": "Kishorganj zila",
                    "abbreviation": "26"
                },
                {
                    "name": "Kurigram zila",
                    "abbreviation": "28"
                },
                {
                    "name": "Kushtia zila",
                    "abbreviation": "30"
                },
                {
                    "name": "Lakshmipur zila",
                    "abbreviation": "31"
                },
                {
                    "name": "Lalmonirhat zila",
                    "abbreviation": "32"
                },
                {
                    "name": "Madaripur zila",
                    "abbreviation": "36"
                },
                {
                    "name": "Magura zila",
                    "abbreviation": "37"
                },
                {
                    "name": "Manikganj zila",
                    "abbreviation": "33"
                },
                {
                    "name": "Meherpur zila",
                    "abbreviation": "39"
                },
                {
                    "name": "Moulvibazar zila",
                    "abbreviation": "38"
                },
                {
                    "name": "Munshiganj zila",
                    "abbreviation": "35"
                },
                {
                    "name": "Mymensingh zila",
                    "abbreviation": "34"
                },
                {
                    "name": "Naogaon zila",
                    "abbreviation": "48"
                },
                {
                    "name": "Narail zila",
                    "abbreviation": "43"
                },
                {
                    "name": "Narayanganj zila",
                    "abbreviation": "40"
                },
                {
                    "name": "Narsingdi zila",
                    "abbreviation": "42"
                },
                {
                    "name": "Natore zila",
                    "abbreviation": "44"
                },
                {
                    "name": "Nawabganj zila",
                    "abbreviation": "45"
                },
                {
                    "name": "Netrakona zila",
                    "abbreviation": "41"
                },
                {
                    "name": "Nilphamari zila",
                    "abbreviation": "46"
                },
                {
                    "name": "Noakhali zila",
                    "abbreviation": "47"
                },
                {
                    "name": "Pabna zila",
                    "abbreviation": "49"
                },
                {
                    "name": "Panchagarh zila",
                    "abbreviation": "52"
                },
                {
                    "name": "Patuakhali zila",
                    "abbreviation": "51"
                },
                {
                    "name": "Pirojpur zila",
                    "abbreviation": "50"
                },
                {
                    "name": "Rajbari zila",
                    "abbreviation": "53"
                },
                {
                    "name": "Rajshahi zila",
                    "abbreviation": "54"
                },
                {
                    "name": "Rangamati zila",
                    "abbreviation": "56"
                },
                {
                    "name": "Rangpur zila",
                    "abbreviation": "55"
                },
                {
                    "name": "Satkhira zila",
                    "abbreviation": "58"
                },
                {
                    "name": "Shariatpur zila",
                    "abbreviation": "62"
                },
                {
                    "name": "Sherpur zila",
                    "abbreviation": "57"
                },
                {
                    "name": "Sirajganj zila",
                    "abbreviation": "59"
                },
                {
                    "name": "Sunamganj zila",
                    "abbreviation": "61"
                },
                {
                    "name": "Sylhet zila",
                    "abbreviation": "60"
                },
                {
                    "name": "Tangail zila",
                    "abbreviation": "63"
                },
                {
                    "name": "Thakurgaon zila",
                    "abbreviation": "64"
                }
            ],
            "1019": [
                {
                    "name": "Brèsckaja voblasc'",
                    "abbreviation": "BR"
                },
                {
                    "name": "Homel'skaja voblasc'",
                    "abbreviation": "HO"
                },
                {
                    "name": "Hrodzenskaja voblasc'",
                    "abbreviation": "HR"
                },
                {
                    "name": "Mahilëuskaja voblasc'",
                    "abbreviation": "MA"
                },
                {
                    "name": "Minskaja voblasc'",
                    "abbreviation": "MI"
                },
                {
                    "name": "Vicebskaja voblasc'",
                    "abbreviation": "VI"
                }
            ],
            "1020": [
                {
                    "name": "Antwerpen",
                    "abbreviation": "VAN"
                },
                {
                    "name": "Brabant Wallon",
                    "abbreviation": "WBR"
                },
                {
                    "name": "Hainaut",
                    "abbreviation": "WHT"
                },
                {
                    "name": "Liege",
                    "abbreviation": "WLG"
                },
                {
                    "name": "Limburg",
                    "abbreviation": "VLI"
                },
                {
                    "name": "Luxembourg",
                    "abbreviation": "WLX"
                },
                {
                    "name": "Namur",
                    "abbreviation": "WNA"
                },
                {
                    "name": "Oost-Vlaanderen",
                    "abbreviation": "VOV"
                },
                {
                    "name": "Vlaams-Brabant",
                    "abbreviation": "VBR"
                },
                {
                    "name": "West-Vlaanderen",
                    "abbreviation": "VWV"
                },
                {
                    "name": "Brussels",
                    "abbreviation": "BRU"
                }
            ],
            "1021": [
                {
                    "name": "Belize",
                    "abbreviation": "BZ"
                },
                {
                    "name": "Cayo",
                    "abbreviation": "CY"
                },
                {
                    "name": "Corozal",
                    "abbreviation": "CZL"
                },
                {
                    "name": "Orange Walk",
                    "abbreviation": "OW"
                },
                {
                    "name": "Stann Creek",
                    "abbreviation": "SC"
                },
                {
                    "name": "Toledo",
                    "abbreviation": "TOL"
                }
            ],
            "1022": [
                {
                    "name": "Alibori",
                    "abbreviation": "AL"
                },
                {
                    "name": "Atakora",
                    "abbreviation": "AK"
                },
                {
                    "name": "Atlantique",
                    "abbreviation": "AQ"
                },
                {
                    "name": "Borgou",
                    "abbreviation": "BO"
                },
                {
                    "name": "Collines",
                    "abbreviation": "CO"
                },
                {
                    "name": "Donga",
                    "abbreviation": "DO"
                },
                {
                    "name": "Kouffo",
                    "abbreviation": "KO"
                },
                {
                    "name": "Littoral",
                    "abbreviation": "LI"
                },
                {
                    "name": "Mono",
                    "abbreviation": "MO"
                },
                {
                    "name": "Oueme",
                    "abbreviation": "OU"
                },
                {
                    "name": "Plateau",
                    "abbreviation": "PL"
                },
                {
                    "name": "Zou",
                    "abbreviation": "ZO"
                }
            ],
            "1024": [
                {
                    "name": "Bumthang",
                    "abbreviation": "33"
                },
                {
                    "name": "Chhukha",
                    "abbreviation": "12"
                },
                {
                    "name": "Dagana",
                    "abbreviation": "22"
                },
                {
                    "name": "Gasa",
                    "abbreviation": "GA"
                },
                {
                    "name": "Ha",
                    "abbreviation": "13"
                },
                {
                    "name": "Lhuentse",
                    "abbreviation": "44"
                },
                {
                    "name": "Monggar",
                    "abbreviation": "42"
                },
                {
                    "name": "Paro",
                    "abbreviation": "11"
                },
                {
                    "name": "Pemagatshel",
                    "abbreviation": "43"
                },
                {
                    "name": "Punakha",
                    "abbreviation": "23"
                },
                {
                    "name": "Samdrup Jongkha",
                    "abbreviation": "45"
                },
                {
                    "name": "Samtee",
                    "abbreviation": "14"
                },
                {
                    "name": "Sarpang",
                    "abbreviation": "31"
                },
                {
                    "name": "Thimphu",
                    "abbreviation": "15"
                },
                {
                    "name": "Trashigang",
                    "abbreviation": "41"
                },
                {
                    "name": "Trashi Yangtse",
                    "abbreviation": "TY"
                },
                {
                    "name": "Trongsa",
                    "abbreviation": "32"
                },
                {
                    "name": "Tsirang",
                    "abbreviation": "21"
                },
                {
                    "name": "Wangdue Phodrang",
                    "abbreviation": "24"
                },
                {
                    "name": "Zhemgang",
                    "abbreviation": "34"
                }
            ],
            "1025": [
                {
                    "name": "Cochabamba",
                    "abbreviation": "C"
                },
                {
                    "name": "Chuquisaca",
                    "abbreviation": "H"
                },
                {
                    "name": "El Beni",
                    "abbreviation": "B"
                },
                {
                    "name": "La Paz",
                    "abbreviation": "L"
                },
                {
                    "name": "Oruro",
                    "abbreviation": "O"
                },
                {
                    "name": "Pando",
                    "abbreviation": "N"
                },
                {
                    "name": "Potosi",
                    "abbreviation": "P"
                },
                {
                    "name": "Tarija",
                    "abbreviation": "T"
                }
            ],
            "1026": [
                {
                    "name": "Federacija Bosna i Hercegovina",
                    "abbreviation": "BIH"
                },
                {
                    "name": "Republika Srpska",
                    "abbreviation": "SRP"
                }
            ],
            "1027": [
                {
                    "name": "Central",
                    "abbreviation": "CE"
                },
                {
                    "name": "Ghanzi",
                    "abbreviation": "GH"
                },
                {
                    "name": "Kgalagadi",
                    "abbreviation": "KG"
                },
                {
                    "name": "Kgatleng",
                    "abbreviation": "KL"
                },
                {
                    "name": "Kweneng",
                    "abbreviation": "KW"
                },
                {
                    "name": "Ngamiland",
                    "abbreviation": "NG"
                },
                {
                    "name": "North-East",
                    "abbreviation": "NE"
                },
                {
                    "name": "North-West",
                    "abbreviation": "NW"
                },
                {
                    "name": "South-East",
                    "abbreviation": "SE"
                },
                {
                    "name": "Southern",
                    "abbreviation": "SO"
                }
            ],
            "1029": [
                {
                    "name": "Acre",
                    "abbreviation": "AC"
                },
                {
                    "name": "Alagoas",
                    "abbreviation": "AL"
                },
                {
                    "name": "Amazonas",
                    "abbreviation": "AM"
                },
                {
                    "name": "Amapa",
                    "abbreviation": "AP"
                },
                {
                    "name": "Baia",
                    "abbreviation": "BA"
                },
                {
                    "name": "Ceara",
                    "abbreviation": "CE"
                },
                {
                    "name": "Distrito Federal",
                    "abbreviation": "DF"
                },
                {
                    "name": "Espirito Santo",
                    "abbreviation": "ES"
                },
                {
                    "name": "Fernando de Noronha",
                    "abbreviation": "FN"
                },
                {
                    "name": "Goias",
                    "abbreviation": "GO"
                },
                {
                    "name": "Maranhao",
                    "abbreviation": "MA"
                },
                {
                    "name": "Minas Gerais",
                    "abbreviation": "MG"
                },
                {
                    "name": "Mato Grosso do Sul",
                    "abbreviation": "MS"
                },
                {
                    "name": "Mato Grosso",
                    "abbreviation": "MT"
                },
                {
                    "name": "Para",
                    "abbreviation": "PA"
                },
                {
                    "name": "Paraiba",
                    "abbreviation": "PB"
                },
                {
                    "name": "Pernambuco",
                    "abbreviation": "PE"
                },
                {
                    "name": "Piaui",
                    "abbreviation": "PI"
                },
                {
                    "name": "Parana",
                    "abbreviation": "PR"
                },
                {
                    "name": "Rio de Janeiro",
                    "abbreviation": "RJ"
                },
                {
                    "name": "Rio Grande do Norte",
                    "abbreviation": "RN"
                },
                {
                    "name": "Rondonia",
                    "abbreviation": "RO"
                },
                {
                    "name": "Roraima",
                    "abbreviation": "RR"
                },
                {
                    "name": "Rio Grande do Sul",
                    "abbreviation": "RS"
                },
                {
                    "name": "Santa Catarina",
                    "abbreviation": "SC"
                },
                {
                    "name": "Sergipe",
                    "abbreviation": "SE"
                },
                {
                    "name": "Sao Paulo",
                    "abbreviation": "SP"
                },
                {
                    "name": "Tocatins",
                    "abbreviation": "TO"
                }
            ],
            "1032": [
                {
                    "name": "Belait",
                    "abbreviation": "BE"
                },
                {
                    "name": "Brunei-Muara",
                    "abbreviation": "BM"
                },
                {
                    "name": "Temburong",
                    "abbreviation": "TE"
                },
                {
                    "name": "Tutong",
                    "abbreviation": "TU"
                }
            ],
            "1033": [
                {
                    "name": "Blagoevgrad",
                    "abbreviation": "01"
                },
                {
                    "name": "Burgas",
                    "abbreviation": "02"
                },
                {
                    "name": "Dobric",
                    "abbreviation": "08"
                },
                {
                    "name": "Gabrovo",
                    "abbreviation": "07"
                },
                {
                    "name": "Haskovo",
                    "abbreviation": "26"
                },
                {
                    "name": "Jambol",
                    "abbreviation": "28"
                },
                {
                    "name": "Kardzali",
                    "abbreviation": "09"
                },
                {
                    "name": "Kjstendil",
                    "abbreviation": "10"
                },
                {
                    "name": "Lovec",
                    "abbreviation": "11"
                },
                {
                    "name": "Montana",
                    "abbreviation": "12"
                },
                {
                    "name": "Pazardzik",
                    "abbreviation": "13"
                },
                {
                    "name": "Pernik",
                    "abbreviation": "14"
                },
                {
                    "name": "Pleven",
                    "abbreviation": "15"
                },
                {
                    "name": "Plovdiv",
                    "abbreviation": "16"
                },
                {
                    "name": "Razgrad",
                    "abbreviation": "17"
                },
                {
                    "name": "Ruse",
                    "abbreviation": "18"
                },
                {
                    "name": "Silistra",
                    "abbreviation": "19"
                },
                {
                    "name": "Sliven",
                    "abbreviation": "20"
                },
                {
                    "name": "Smoljan",
                    "abbreviation": "21"
                },
                {
                    "name": "Sofia",
                    "abbreviation": "23"
                },
                {
                    "name": "Stara Zagora",
                    "abbreviation": "24"
                },
                {
                    "name": "Sumen",
                    "abbreviation": "27"
                },
                {
                    "name": "Targoviste",
                    "abbreviation": "25"
                },
                {
                    "name": "Varna",
                    "abbreviation": "03"
                },
                {
                    "name": "Veliko Tarnovo",
                    "abbreviation": "04"
                },
                {
                    "name": "Vidin",
                    "abbreviation": "05"
                },
                {
                    "name": "Vraca",
                    "abbreviation": "06"
                }
            ],
            "1034": [
                {
                    "name": "Bale",
                    "abbreviation": "BAL"
                },
                {
                    "name": "Bam",
                    "abbreviation": "BAM"
                },
                {
                    "name": "Banwa",
                    "abbreviation": "BAN"
                },
                {
                    "name": "Bazega",
                    "abbreviation": "BAZ"
                },
                {
                    "name": "Bougouriba",
                    "abbreviation": "BGR"
                },
                {
                    "name": "Boulgou",
                    "abbreviation": "BLG"
                },
                {
                    "name": "Boulkiemde",
                    "abbreviation": "BLK"
                },
                {
                    "name": "Comoe",
                    "abbreviation": "COM"
                },
                {
                    "name": "Ganzourgou",
                    "abbreviation": "GAN"
                },
                {
                    "name": "Gnagna",
                    "abbreviation": "GNA"
                },
                {
                    "name": "Gourma",
                    "abbreviation": "GOU"
                },
                {
                    "name": "Houet",
                    "abbreviation": "HOU"
                },
                {
                    "name": "Ioba",
                    "abbreviation": "IOB"
                },
                {
                    "name": "Kadiogo",
                    "abbreviation": "KAD"
                },
                {
                    "name": "Kenedougou",
                    "abbreviation": "KEN"
                },
                {
                    "name": "Komondjari",
                    "abbreviation": "KMD"
                },
                {
                    "name": "Kompienga",
                    "abbreviation": "KMP"
                },
                {
                    "name": "Kossi",
                    "abbreviation": "KOS"
                },
                {
                    "name": "Koulpulogo",
                    "abbreviation": "KOP"
                },
                {
                    "name": "Kouritenga",
                    "abbreviation": "KOT"
                },
                {
                    "name": "Kourweogo",
                    "abbreviation": "KOW"
                },
                {
                    "name": "Leraba",
                    "abbreviation": "LER"
                },
                {
                    "name": "Loroum",
                    "abbreviation": "LOR"
                },
                {
                    "name": "Mouhoun",
                    "abbreviation": "MOU"
                },
                {
                    "name": "Nahouri",
                    "abbreviation": "NAO"
                },
                {
                    "name": "Namentenga",
                    "abbreviation": "NAM"
                },
                {
                    "name": "Nayala",
                    "abbreviation": "NAY"
                },
                {
                    "name": "Noumbiel",
                    "abbreviation": "NOU"
                },
                {
                    "name": "Oubritenga",
                    "abbreviation": "OUB"
                },
                {
                    "name": "Oudalan",
                    "abbreviation": "OUD"
                },
                {
                    "name": "Passore",
                    "abbreviation": "PAS"
                },
                {
                    "name": "Poni",
                    "abbreviation": "PON"
                },
                {
                    "name": "Sanguie",
                    "abbreviation": "SNG"
                },
                {
                    "name": "Sanmatenga",
                    "abbreviation": "SMT"
                },
                {
                    "name": "Seno",
                    "abbreviation": "SEN"
                },
                {
                    "name": "Siasili",
                    "abbreviation": "SIS"
                },
                {
                    "name": "Soum",
                    "abbreviation": "SOM"
                },
                {
                    "name": "Sourou",
                    "abbreviation": "SOR"
                },
                {
                    "name": "Tapoa",
                    "abbreviation": "TAP"
                },
                {
                    "name": "Tui",
                    "abbreviation": "TUI"
                },
                {
                    "name": "Yagha",
                    "abbreviation": "YAG"
                },
                {
                    "name": "Yatenga",
                    "abbreviation": "YAT"
                },
                {
                    "name": "Ziro",
                    "abbreviation": "ZIR"
                },
                {
                    "name": "Zondoma",
                    "abbreviation": "ZON"
                },
                {
                    "name": "Zoundweogo",
                    "abbreviation": "ZOU"
                }
            ],
            "1035": [
                {
                    "name": "Ayeyarwady",
                    "abbreviation": "07"
                },
                {
                    "name": "Bago",
                    "abbreviation": "02"
                },
                {
                    "name": "Magway",
                    "abbreviation": "03"
                },
                {
                    "name": "Mandalay",
                    "abbreviation": "04"
                },
                {
                    "name": "Sagaing",
                    "abbreviation": "01"
                },
                {
                    "name": "Tanintharyi",
                    "abbreviation": "05"
                },
                {
                    "name": "Yangon",
                    "abbreviation": "06"
                },
                {
                    "name": "Chin",
                    "abbreviation": "14"
                },
                {
                    "name": "Kachin",
                    "abbreviation": "11"
                },
                {
                    "name": "Kayah",
                    "abbreviation": "12"
                },
                {
                    "name": "Kayin",
                    "abbreviation": "13"
                },
                {
                    "name": "Mon",
                    "abbreviation": "15"
                },
                {
                    "name": "Rakhine",
                    "abbreviation": "16"
                },
                {
                    "name": "Shan",
                    "abbreviation": "17"
                }
            ],
            "1036": [
                {
                    "name": "Bubanza",
                    "abbreviation": "BB"
                },
                {
                    "name": "Bujumbura",
                    "abbreviation": "BJ"
                },
                {
                    "name": "Bururi",
                    "abbreviation": "BR"
                },
                {
                    "name": "Cankuzo",
                    "abbreviation": "CA"
                },
                {
                    "name": "Cibitoke",
                    "abbreviation": "CI"
                },
                {
                    "name": "Gitega",
                    "abbreviation": "GI"
                },
                {
                    "name": "Karuzi",
                    "abbreviation": "KR"
                },
                {
                    "name": "Kayanza",
                    "abbreviation": "KY"
                },
                {
                    "name": "Makamba",
                    "abbreviation": "MA"
                },
                {
                    "name": "Muramvya",
                    "abbreviation": "MU"
                },
                {
                    "name": "Mwaro",
                    "abbreviation": "MW"
                },
                {
                    "name": "Ngozi",
                    "abbreviation": "NG"
                },
                {
                    "name": "Rutana",
                    "abbreviation": "RT"
                },
                {
                    "name": "Ruyigi",
                    "abbreviation": "RY"
                }
            ],
            "1037": [
                {
                    "name": "Krong Kaeb",
                    "abbreviation": "23"
                },
                {
                    "name": "Krong Pailin",
                    "abbreviation": "24"
                },
                {
                    "name": "Xrong Preah Sihanouk",
                    "abbreviation": "18"
                },
                {
                    "name": "Phnom Penh",
                    "abbreviation": "12"
                },
                {
                    "name": "Baat Dambang",
                    "abbreviation": "2"
                },
                {
                    "name": "Banteay Mean Chey",
                    "abbreviation": "1"
                },
                {
                    "name": "Rampong Chaam",
                    "abbreviation": "3"
                },
                {
                    "name": "Kampong Chhnang",
                    "abbreviation": "4"
                },
                {
                    "name": "Kampong Spueu",
                    "abbreviation": "5"
                },
                {
                    "name": "Kampong Thum",
                    "abbreviation": "6"
                },
                {
                    "name": "Kampot",
                    "abbreviation": "7"
                },
                {
                    "name": "Kandaal",
                    "abbreviation": "8"
                },
                {
                    "name": "Kach Kong",
                    "abbreviation": "9"
                },
                {
                    "name": "Krachoh",
                    "abbreviation": "10"
                },
                {
                    "name": "Mondol Kiri",
                    "abbreviation": "11"
                },
                {
                    "name": "Otdar Mean Chey",
                    "abbreviation": "22"
                },
                {
                    "name": "Pousaat",
                    "abbreviation": "15"
                },
                {
                    "name": "Preah Vihear",
                    "abbreviation": "13"
                },
                {
                    "name": "Prey Veaeng",
                    "abbreviation": "14"
                },
                {
                    "name": "Rotanak Kiri",
                    "abbreviation": "16"
                },
                {
                    "name": "Siem Reab",
                    "abbreviation": "17"
                },
                {
                    "name": "Stueng Traeng",
                    "abbreviation": "19"
                },
                {
                    "name": "Svaay Rieng",
                    "abbreviation": "20"
                },
                {
                    "name": "Taakaev",
                    "abbreviation": "21"
                }
            ],
            "1038": [
                {
                    "name": "Adamaoua",
                    "abbreviation": "AD"
                },
                {
                    "name": "Centre",
                    "abbreviation": "CE"
                },
                {
                    "name": "East",
                    "abbreviation": "ES"
                },
                {
                    "name": "Far North",
                    "abbreviation": "EN"
                },
                {
                    "name": "North",
                    "abbreviation": "NO"
                },
                {
                    "name": "South",
                    "abbreviation": "SW"
                },
                {
                    "name": "South-West",
                    "abbreviation": "SW"
                },
                {
                    "name": "West",
                    "abbreviation": "OU"
                }
            ],
            "1039": [
                {
                    "name": "Alberta",
                    "abbreviation": "AB"
                },
                {
                    "name": "British Columbia",
                    "abbreviation": "BC"
                },
                {
                    "name": "Manitoba",
                    "abbreviation": "MB"
                },
                {
                    "name": "New Brunswick",
                    "abbreviation": "NB"
                },
                {
                    "name": "Newfoundland and Labrador",
                    "abbreviation": "NL"
                },
                {
                    "name": "Northwest Territories",
                    "abbreviation": "NT"
                },
                {
                    "name": "Nova Scotia",
                    "abbreviation": "NS"
                },
                {
                    "name": "Nunavut",
                    "abbreviation": "NU"
                },
                {
                    "name": "Ontario",
                    "abbreviation": "ON"
                },
                {
                    "name": "Prince Edward Island",
                    "abbreviation": "PE"
                },
                {
                    "name": "Quebec",
                    "abbreviation": "QC"
                },
                {
                    "name": "Saskatchewan",
                    "abbreviation": "SK"
                },
                {
                    "name": "Yukon Territory",
                    "abbreviation": "YT"
                }
            ],
            "1040": [
                {
                    "name": "Boa Vista",
                    "abbreviation": "BV"
                },
                {
                    "name": "Brava",
                    "abbreviation": "BR"
                },
                {
                    "name": "Calheta de Sao Miguel",
                    "abbreviation": "CS"
                },
                {
                    "name": "Fogo",
                    "abbreviation": "FO"
                },
                {
                    "name": "Maio",
                    "abbreviation": "MA"
                },
                {
                    "name": "Mosteiros",
                    "abbreviation": "MO"
                },
                {
                    "name": "Paul",
                    "abbreviation": "PA"
                },
                {
                    "name": "Porto Novo",
                    "abbreviation": "PN"
                },
                {
                    "name": "Praia",
                    "abbreviation": "PR"
                },
                {
                    "name": "Ribeira Grande",
                    "abbreviation": "RG"
                },
                {
                    "name": "Sal",
                    "abbreviation": "SL"
                },
                {
                    "name": "Sao Domingos",
                    "abbreviation": "SD"
                },
                {
                    "name": "Sao Filipe",
                    "abbreviation": "SF"
                },
                {
                    "name": "Sao Nicolau",
                    "abbreviation": "SN"
                },
                {
                    "name": "Sao Vicente",
                    "abbreviation": "SV"
                },
                {
                    "name": "Tarrafal",
                    "abbreviation": "TA"
                }
            ],
            "1042": [
                {
                    "name": "Bangui",
                    "abbreviation": "BGF"
                },
                {
                    "name": "Bamingui-Bangoran",
                    "abbreviation": "BB"
                },
                {
                    "name": "Basse-Kotto",
                    "abbreviation": "BK"
                },
                {
                    "name": "Haute-Kotto",
                    "abbreviation": "HK"
                },
                {
                    "name": "Haut-Mbomou",
                    "abbreviation": "HM"
                },
                {
                    "name": "Kemo",
                    "abbreviation": "KG"
                },
                {
                    "name": "Lobaye",
                    "abbreviation": "LB"
                },
                {
                    "name": "Mambere-Kadei",
                    "abbreviation": "HS"
                },
                {
                    "name": "Mbomou",
                    "abbreviation": "MB"
                },
                {
                    "name": "Nana-Grebizi",
                    "abbreviation": "KB"
                },
                {
                    "name": "Nana-Mambere",
                    "abbreviation": "NM"
                },
                {
                    "name": "Ombella-Mpoko",
                    "abbreviation": "MP"
                },
                {
                    "name": "Ouaka",
                    "abbreviation": "UK"
                },
                {
                    "name": "Ouham",
                    "abbreviation": "AC"
                },
                {
                    "name": "Ouham-Pende",
                    "abbreviation": "OP"
                },
                {
                    "name": "Sangha-Mbaere",
                    "abbreviation": "SE"
                },
                {
                    "name": "Vakaga",
                    "abbreviation": "VR"
                }
            ],
            "1043": [
                {
                    "name": "Batha",
                    "abbreviation": "BA"
                },
                {
                    "name": "Biltine",
                    "abbreviation": "BI"
                },
                {
                    "name": "Borkou-Ennedi-Tibesti",
                    "abbreviation": "BET"
                },
                {
                    "name": "Chari-Baguirmi",
                    "abbreviation": "CB"
                },
                {
                    "name": "Guera",
                    "abbreviation": "GR"
                },
                {
                    "name": "Kanem",
                    "abbreviation": "KA"
                },
                {
                    "name": "Lac",
                    "abbreviation": "LC"
                },
                {
                    "name": "Logone-Occidental",
                    "abbreviation": "LO"
                },
                {
                    "name": "Logone-Oriental",
                    "abbreviation": "LR"
                },
                {
                    "name": "Mayo-Kebbi",
                    "abbreviation": "MK"
                },
                {
                    "name": "Moyen-Chari",
                    "abbreviation": "MC"
                },
                {
                    "name": "Ouaddai",
                    "abbreviation": "OD"
                },
                {
                    "name": "Salamat",
                    "abbreviation": "SA"
                },
                {
                    "name": "Tandjile",
                    "abbreviation": "TA"
                }
            ],
            "1044": [
                {
                    "name": "Aisen del General Carlos Ibanez del Campo",
                    "abbreviation": "AI"
                },
                {
                    "name": "Antofagasta",
                    "abbreviation": "AN"
                },
                {
                    "name": "Araucania",
                    "abbreviation": "AR"
                },
                {
                    "name": "Atacama",
                    "abbreviation": "AT"
                },
                {
                    "name": "Bio-Bio",
                    "abbreviation": "BI"
                },
                {
                    "name": "Coquimbo",
                    "abbreviation": "CO"
                },
                {
                    "name": "Libertador General Bernardo O'Higgins",
                    "abbreviation": "LI"
                },
                {
                    "name": "Los Lagos",
                    "abbreviation": "LL"
                },
                {
                    "name": "Magallanes",
                    "abbreviation": "MA"
                },
                {
                    "name": "Maule",
                    "abbreviation": "ML"
                },
                {
                    "name": "Region Metropolitana de Santiago",
                    "abbreviation": "RM"
                },
                {
                    "name": "Tarapaca",
                    "abbreviation": "TA"
                },
                {
                    "name": "Valparaiso",
                    "abbreviation": "VS"
                }
            ],
            "1045": [
                {
                    "name": "Beijing",
                    "abbreviation": "11"
                },
                {
                    "name": "Chongqing",
                    "abbreviation": "50"
                },
                {
                    "name": "Shanghai",
                    "abbreviation": "31"
                },
                {
                    "name": "Tianjin",
                    "abbreviation": "12"
                },
                {
                    "name": "Anhui",
                    "abbreviation": "34"
                },
                {
                    "name": "Fujian",
                    "abbreviation": "35"
                },
                {
                    "name": "Gansu",
                    "abbreviation": "62"
                },
                {
                    "name": "Guangdong",
                    "abbreviation": "44"
                },
                {
                    "name": "Guizhou",
                    "abbreviation": "52"
                },
                {
                    "name": "Hainan",
                    "abbreviation": "46"
                },
                {
                    "name": "Hebei",
                    "abbreviation": "13"
                },
                {
                    "name": "Heilongjiang",
                    "abbreviation": "23"
                },
                {
                    "name": "Henan",
                    "abbreviation": "41"
                },
                {
                    "name": "Hubei",
                    "abbreviation": "42"
                },
                {
                    "name": "Hunan",
                    "abbreviation": "43"
                },
                {
                    "name": "Jiangsu",
                    "abbreviation": "32"
                },
                {
                    "name": "Jiangxi",
                    "abbreviation": "36"
                },
                {
                    "name": "Jilin",
                    "abbreviation": "22"
                },
                {
                    "name": "Liaoning",
                    "abbreviation": "21"
                },
                {
                    "name": "Qinghai",
                    "abbreviation": "63"
                },
                {
                    "name": "Shaanxi",
                    "abbreviation": "61"
                },
                {
                    "name": "Shandong",
                    "abbreviation": "37"
                },
                {
                    "name": "Shanxi",
                    "abbreviation": "14"
                },
                {
                    "name": "Sichuan",
                    "abbreviation": "51"
                },
                {
                    "name": "Taiwan",
                    "abbreviation": "71"
                },
                {
                    "name": "Yunnan",
                    "abbreviation": "53"
                },
                {
                    "name": "Zhejiang",
                    "abbreviation": "33"
                },
                {
                    "name": "Guangxi",
                    "abbreviation": "45"
                },
                {
                    "name": "Neia Mongol (mn)",
                    "abbreviation": "15"
                },
                {
                    "name": "Xinjiang",
                    "abbreviation": "65"
                },
                {
                    "name": "Xizang",
                    "abbreviation": "54"
                },
                {
                    "name": "Hong Kong",
                    "abbreviation": "91"
                },
                {
                    "name": "Macau",
                    "abbreviation": "92"
                }
            ],
            "1048": [
                {
                    "name": "Distrito Capital de Bogotá",
                    "abbreviation": "DC"
                },
                {
                    "name": "Amazonea",
                    "abbreviation": "AMA"
                },
                {
                    "name": "Antioquia",
                    "abbreviation": "ANT"
                },
                {
                    "name": "Arauca",
                    "abbreviation": "ARA"
                },
                {
                    "name": "Atlántico",
                    "abbreviation": "ATL"
                },
                {
                    "name": "Bolívar",
                    "abbreviation": "BOL"
                },
                {
                    "name": "Boyacá",
                    "abbreviation": "BOY"
                },
                {
                    "name": "Caldea",
                    "abbreviation": "CAL"
                },
                {
                    "name": "Caquetá",
                    "abbreviation": "CAQ"
                },
                {
                    "name": "Casanare",
                    "abbreviation": "CAS"
                },
                {
                    "name": "Cauca",
                    "abbreviation": "CAU"
                },
                {
                    "name": "Cesar",
                    "abbreviation": "CES"
                },
                {
                    "name": "Córdoba",
                    "abbreviation": "COR"
                },
                {
                    "name": "Cundinamarca",
                    "abbreviation": "CUN"
                },
                {
                    "name": "Chocó",
                    "abbreviation": "CHO"
                },
                {
                    "name": "Guainía",
                    "abbreviation": "GUA"
                },
                {
                    "name": "Guaviare",
                    "abbreviation": "GUV"
                },
                {
                    "name": "La Guajira",
                    "abbreviation": "LAG"
                },
                {
                    "name": "Magdalena",
                    "abbreviation": "MAG"
                },
                {
                    "name": "Meta",
                    "abbreviation": "MET"
                },
                {
                    "name": "Nariño",
                    "abbreviation": "NAR"
                },
                {
                    "name": "Norte de Santander",
                    "abbreviation": "NSA"
                },
                {
                    "name": "Putumayo",
                    "abbreviation": "PUT"
                },
                {
                    "name": "Quindio",
                    "abbreviation": "QUI"
                },
                {
                    "name": "Risaralda",
                    "abbreviation": "RIS"
                },
                {
                    "name": "San Andrés, Providencia y Santa Catalina",
                    "abbreviation": "SAP"
                },
                {
                    "name": "Santander",
                    "abbreviation": "SAN"
                },
                {
                    "name": "Sucre",
                    "abbreviation": "SUC"
                },
                {
                    "name": "Tolima",
                    "abbreviation": "TOL"
                },
                {
                    "name": "Valle del Cauca",
                    "abbreviation": "VAC"
                },
                {
                    "name": "Vaupés",
                    "abbreviation": "VAU"
                },
                {
                    "name": "Vichada",
                    "abbreviation": "VID"
                }
            ],
            "1049": [
                {
                    "name": "Anjouan Ndzouani",
                    "abbreviation": "A"
                },
                {
                    "name": "Grande Comore Ngazidja",
                    "abbreviation": "G"
                },
                {
                    "name": "Moheli Moili",
                    "abbreviation": "M"
                }
            ],
            "1050": [
                {
                    "name": "Kinshasa",
                    "abbreviation": "KN"
                },
                {
                    "name": "Bandundu",
                    "abbreviation": "BN"
                },
                {
                    "name": "Bas-Congo",
                    "abbreviation": "BC"
                },
                {
                    "name": "Equateur",
                    "abbreviation": "EQ"
                },
                {
                    "name": "Haut-Congo",
                    "abbreviation": "HC"
                },
                {
                    "name": "Kasai-Occidental",
                    "abbreviation": "KW"
                },
                {
                    "name": "Kasai-Oriental",
                    "abbreviation": "KE"
                },
                {
                    "name": "Katanga",
                    "abbreviation": "KA"
                },
                {
                    "name": "Maniema",
                    "abbreviation": "MA"
                },
                {
                    "name": "Nord-Kivu",
                    "abbreviation": "NK"
                },
                {
                    "name": "Orientale",
                    "abbreviation": "OR"
                },
                {
                    "name": "Sud-Kivu",
                    "abbreviation": "SK"
                }
            ],
            "1051": [
                {
                    "name": "Brazzaville",
                    "abbreviation": "BZV"
                },
                {
                    "name": "Bouenza",
                    "abbreviation": "11"
                },
                {
                    "name": "Cuvette",
                    "abbreviation": "8"
                },
                {
                    "name": "Cuvette-Ouest",
                    "abbreviation": "15"
                },
                {
                    "name": "Kouilou",
                    "abbreviation": "5"
                },
                {
                    "name": "Lekoumou",
                    "abbreviation": "2"
                },
                {
                    "name": "Likouala",
                    "abbreviation": "7"
                },
                {
                    "name": "Niari",
                    "abbreviation": "9"
                },
                {
                    "name": "Plateaux",
                    "abbreviation": "14"
                },
                {
                    "name": "Pool",
                    "abbreviation": "12"
                },
                {
                    "name": "Sangha",
                    "abbreviation": "13"
                }
            ],
            "1053": [
                {
                    "name": "Alajuela",
                    "abbreviation": "A"
                },
                {
                    "name": "Cartago",
                    "abbreviation": "C"
                },
                {
                    "name": "Guanacaste",
                    "abbreviation": "G"
                },
                {
                    "name": "Heredia",
                    "abbreviation": "H"
                },
                {
                    "name": "Limon",
                    "abbreviation": "L"
                },
                {
                    "name": "Puntarenas",
                    "abbreviation": "P"
                },
                {
                    "name": "San Jose",
                    "abbreviation": "SJ"
                }
            ],
            "1054": [
                {
                    "name": "18 Montagnes",
                    "abbreviation": "06"
                },
                {
                    "name": "Agnebi",
                    "abbreviation": "16"
                },
                {
                    "name": "Bas-Sassandra",
                    "abbreviation": "09"
                },
                {
                    "name": "Denguele",
                    "abbreviation": "10"
                },
                {
                    "name": "Haut-Sassandra",
                    "abbreviation": "02"
                },
                {
                    "name": "Lacs",
                    "abbreviation": "07"
                },
                {
                    "name": "Lagunes",
                    "abbreviation": "01"
                },
                {
                    "name": "Marahoue",
                    "abbreviation": "12"
                },
                {
                    "name": "Moyen-Comoe",
                    "abbreviation": "05"
                },
                {
                    "name": "Nzi-Comoe",
                    "abbreviation": "11"
                },
                {
                    "name": "Savanes",
                    "abbreviation": "03"
                },
                {
                    "name": "Sud-Bandama",
                    "abbreviation": "15"
                },
                {
                    "name": "Sud-Comoe",
                    "abbreviation": "13"
                },
                {
                    "name": "Vallee du Bandama",
                    "abbreviation": "04"
                },
                {
                    "name": "Worodouqou",
                    "abbreviation": "14"
                },
                {
                    "name": "Zanzan",
                    "abbreviation": "08"
                }
            ],
            "1055": [
                {
                    "name": "Bjelovarsko-bilogorska zupanija",
                    "abbreviation": "07"
                },
                {
                    "name": "Brodsko-posavska zupanija",
                    "abbreviation": "12"
                },
                {
                    "name": "Dubrovacko-neretvanska zupanija",
                    "abbreviation": "19"
                },
                {
                    "name": "Istarska zupanija",
                    "abbreviation": "18"
                },
                {
                    "name": "Karlovacka zupanija",
                    "abbreviation": "04"
                },
                {
                    "name": "Koprivnickco-krizevacka zupanija",
                    "abbreviation": "06"
                },
                {
                    "name": "Krapinako-zagorska zupanija",
                    "abbreviation": "02"
                },
                {
                    "name": "Licko-senjska zupanija",
                    "abbreviation": "09"
                },
                {
                    "name": "Medimurska zupanija",
                    "abbreviation": "20"
                },
                {
                    "name": "Osjecko-baranjska zupanija",
                    "abbreviation": "14"
                },
                {
                    "name": "Pozesko-slavonska zupanija",
                    "abbreviation": "11"
                },
                {
                    "name": "Primorsko-goranska zupanija",
                    "abbreviation": "08"
                },
                {
                    "name": "Sisacko-moelavacka Iupanija",
                    "abbreviation": "03"
                },
                {
                    "name": "Splitako-dalmatinska zupanija",
                    "abbreviation": "17"
                },
                {
                    "name": "Sibenako-kninska zupanija",
                    "abbreviation": "15"
                },
                {
                    "name": "Varaidinska zupanija",
                    "abbreviation": "05"
                },
                {
                    "name": "VirovitiEko-podravska zupanija",
                    "abbreviation": "10"
                },
                {
                    "name": "VuRovarako-srijemska zupanija",
                    "abbreviation": "16"
                },
                {
                    "name": "Zadaraka",
                    "abbreviation": "13"
                },
                {
                    "name": "Zagrebacka zupanija",
                    "abbreviation": "01"
                }
            ],
            "1056": [
                {
                    "name": "Camagey",
                    "abbreviation": "09"
                },
                {
                    "name": "Ciego de `vila",
                    "abbreviation": "08"
                },
                {
                    "name": "Cienfuegos",
                    "abbreviation": "06"
                },
                {
                    "name": "Ciudad de La Habana",
                    "abbreviation": "03"
                },
                {
                    "name": "Granma",
                    "abbreviation": "12"
                },
                {
                    "name": "Guantanamo",
                    "abbreviation": "14"
                },
                {
                    "name": "Holquin",
                    "abbreviation": "11"
                },
                {
                    "name": "La Habana",
                    "abbreviation": "02"
                },
                {
                    "name": "Las Tunas",
                    "abbreviation": "10"
                },
                {
                    "name": "Matanzas",
                    "abbreviation": "04"
                },
                {
                    "name": "Pinar del Rio",
                    "abbreviation": "01"
                },
                {
                    "name": "Sancti Spiritus",
                    "abbreviation": "07"
                },
                {
                    "name": "Santiago de Cuba",
                    "abbreviation": "13"
                },
                {
                    "name": "Villa Clara",
                    "abbreviation": "05"
                },
                {
                    "name": "Isla de la Juventud",
                    "abbreviation": "99"
                },
                {
                    "name": "Pinar del Roo",
                    "abbreviation": "PR"
                },
                {
                    "name": "Ciego de Avila",
                    "abbreviation": "CA"
                },
                {
                    "name": "Camagoey",
                    "abbreviation": "CG"
                },
                {
                    "name": "Holgun",
                    "abbreviation": "HO"
                },
                {
                    "name": "Sancti Spritus",
                    "abbreviation": "SS"
                },
                {
                    "name": "Municipio Especial Isla de la Juventud",
                    "abbreviation": "IJ"
                }
            ],
            "1057": [
                {
                    "name": "Ammochostos Magusa",
                    "abbreviation": "04"
                },
                {
                    "name": "Keryneia",
                    "abbreviation": "06"
                },
                {
                    "name": "Larnaka",
                    "abbreviation": "03"
                },
                {
                    "name": "Lefkosia",
                    "abbreviation": "01"
                },
                {
                    "name": "Lemesos",
                    "abbreviation": "02"
                },
                {
                    "name": "Pafos",
                    "abbreviation": "05"
                }
            ],
            "1058": [
                {
                    "name": "Jihočeský kraj",
                    "abbreviation": "JC"
                },
                {
                    "name": "Jihomoravský kraj",
                    "abbreviation": "JM"
                },
                {
                    "name": "Karlovarský kraj",
                    "abbreviation": "KA"
                },
                {
                    "name": "Královéhradecký kraj",
                    "abbreviation": "KR"
                },
                {
                    "name": "Liberecký kraj",
                    "abbreviation": "LI"
                },
                {
                    "name": "Moravskoslezský kraj",
                    "abbreviation": "MO"
                },
                {
                    "name": "Olomoucký kraj",
                    "abbreviation": "OL"
                },
                {
                    "name": "Pardubický kraj",
                    "abbreviation": "PA"
                },
                {
                    "name": "Plzeňský kraj",
                    "abbreviation": "PL"
                },
                {
                    "name": "Praha, hlavní město",
                    "abbreviation": "PR"
                },
                {
                    "name": "Středočeský kraj",
                    "abbreviation": "ST"
                },
                {
                    "name": "Ústecký kraj",
                    "abbreviation": "US"
                },
                {
                    "name": "Vysočina",
                    "abbreviation": "VY"
                },
                {
                    "name": "Zlínský kraj",
                    "abbreviation": "ZL"
                }
            ],
            "1059": [
                {
                    "name": "Frederiksberg",
                    "abbreviation": "147"
                },
                {
                    "name": "Copenhagen City",
                    "abbreviation": "101"
                },
                {
                    "name": "Copenhagen",
                    "abbreviation": "015"
                },
                {
                    "name": "Frederiksborg",
                    "abbreviation": "020"
                },
                {
                    "name": "Roskilde",
                    "abbreviation": "025"
                },
                {
                    "name": "Vestsjælland",
                    "abbreviation": "030"
                },
                {
                    "name": "Storstrøm",
                    "abbreviation": "035"
                },
                {
                    "name": "Bornholm",
                    "abbreviation": "040"
                },
                {
                    "name": "Fyn",
                    "abbreviation": "042"
                },
                {
                    "name": "South Jutland",
                    "abbreviation": "050"
                },
                {
                    "name": "Ribe",
                    "abbreviation": "055"
                },
                {
                    "name": "Vejle",
                    "abbreviation": "060"
                },
                {
                    "name": "Ringkjøbing",
                    "abbreviation": "065"
                },
                {
                    "name": "Århus",
                    "abbreviation": "070"
                },
                {
                    "name": "Viborg",
                    "abbreviation": "076"
                },
                {
                    "name": "North Jutland",
                    "abbreviation": "080"
                }
            ],
            "1060": [
                {
                    "name": "Ali Sabiah",
                    "abbreviation": "AS"
                },
                {
                    "name": "Dikhil",
                    "abbreviation": "DI"
                },
                {
                    "name": "Djibouti",
                    "abbreviation": "DJ"
                },
                {
                    "name": "Obock",
                    "abbreviation": "OB"
                },
                {
                    "name": "Tadjoura",
                    "abbreviation": "TA"
                }
            ],
            "1062": [
                {
                    "name": "Distrito Nacional (Santo Domingo)",
                    "abbreviation": "01"
                },
                {
                    "name": "Azua",
                    "abbreviation": "02"
                },
                {
                    "name": "Bahoruco",
                    "abbreviation": "03"
                },
                {
                    "name": "Barahona",
                    "abbreviation": "04"
                },
                {
                    "name": "Dajabón",
                    "abbreviation": "05"
                },
                {
                    "name": "Duarte",
                    "abbreviation": "06"
                },
                {
                    "name": "El Seybo [El Seibo]",
                    "abbreviation": "08"
                },
                {
                    "name": "Espaillat",
                    "abbreviation": "09"
                },
                {
                    "name": "Hato Mayor",
                    "abbreviation": "30"
                },
                {
                    "name": "Independencia",
                    "abbreviation": "10"
                },
                {
                    "name": "La Altagracia",
                    "abbreviation": "11"
                },
                {
                    "name": "La Estrelleta [Elias Pina]",
                    "abbreviation": "07"
                },
                {
                    "name": "La Romana",
                    "abbreviation": "12"
                },
                {
                    "name": "La Vega",
                    "abbreviation": "13"
                },
                {
                    "name": "Maroia Trinidad Sánchez",
                    "abbreviation": "14"
                },
                {
                    "name": "Monseñor Nouel",
                    "abbreviation": "28"
                },
                {
                    "name": "Monte Cristi",
                    "abbreviation": "15"
                },
                {
                    "name": "Monte Plata",
                    "abbreviation": "29"
                },
                {
                    "name": "Pedernales",
                    "abbreviation": "16"
                },
                {
                    "name": "Peravia",
                    "abbreviation": "17"
                },
                {
                    "name": "Puerto Plata",
                    "abbreviation": "18"
                },
                {
                    "name": "Salcedo",
                    "abbreviation": "19"
                },
                {
                    "name": "Samaná",
                    "abbreviation": "20"
                },
                {
                    "name": "San Cristóbal",
                    "abbreviation": "21"
                },
                {
                    "name": "San Pedro de Macorís",
                    "abbreviation": "23"
                },
                {
                    "name": "Sánchez Ramírez",
                    "abbreviation": "24"
                },
                {
                    "name": "Santiago",
                    "abbreviation": "25"
                },
                {
                    "name": "Santiago Rodríguez",
                    "abbreviation": "26"
                },
                {
                    "name": "Valverde",
                    "abbreviation": "27"
                }
            ],
            "1063": [
                {
                    "name": "Aileu",
                    "abbreviation": "AL"
                },
                {
                    "name": "Ainaro",
                    "abbreviation": "AN"
                },
                {
                    "name": "Bacucau",
                    "abbreviation": "BA"
                },
                {
                    "name": "Bobonaro",
                    "abbreviation": "BO"
                },
                {
                    "name": "Cova Lima",
                    "abbreviation": "CO"
                },
                {
                    "name": "Dili",
                    "abbreviation": "DI"
                },
                {
                    "name": "Ermera",
                    "abbreviation": "ER"
                },
                {
                    "name": "Laulem",
                    "abbreviation": "LA"
                },
                {
                    "name": "Liquica",
                    "abbreviation": "LI"
                },
                {
                    "name": "Manatuto",
                    "abbreviation": "MT"
                },
                {
                    "name": "Manafahi",
                    "abbreviation": "MF"
                },
                {
                    "name": "Oecussi",
                    "abbreviation": "OE"
                },
                {
                    "name": "Viqueque",
                    "abbreviation": "VI"
                }
            ],
            "1064": [
                {
                    "name": "Azuay",
                    "abbreviation": "A"
                },
                {
                    "name": "Bolivar",
                    "abbreviation": "B"
                },
                {
                    "name": "Canar",
                    "abbreviation": "F"
                },
                {
                    "name": "Carchi",
                    "abbreviation": "C"
                },
                {
                    "name": "Cotopaxi",
                    "abbreviation": "X"
                },
                {
                    "name": "Chimborazo",
                    "abbreviation": "H"
                },
                {
                    "name": "El Oro",
                    "abbreviation": "O"
                },
                {
                    "name": "Esmeraldas",
                    "abbreviation": "E"
                },
                {
                    "name": "Galapagos",
                    "abbreviation": "W"
                },
                {
                    "name": "Guayas",
                    "abbreviation": "G"
                },
                {
                    "name": "Imbabura",
                    "abbreviation": "I"
                },
                {
                    "name": "Loja",
                    "abbreviation": "L"
                },
                {
                    "name": "Los Rios",
                    "abbreviation": "R"
                },
                {
                    "name": "Manabi",
                    "abbreviation": "M"
                },
                {
                    "name": "Morona-Santiago",
                    "abbreviation": "S"
                },
                {
                    "name": "Napo",
                    "abbreviation": "N"
                },
                {
                    "name": "Orellana",
                    "abbreviation": "D"
                },
                {
                    "name": "Pastaza",
                    "abbreviation": "Y"
                },
                {
                    "name": "Pichincha",
                    "abbreviation": "P"
                },
                {
                    "name": "Sucumbios",
                    "abbreviation": "U"
                },
                {
                    "name": "Tungurahua",
                    "abbreviation": "T"
                },
                {
                    "name": "Zamora-Chinchipe",
                    "abbreviation": "Z"
                }
            ],
            "1065": [
                {
                    "name": "Ad Daqahllyah",
                    "abbreviation": "DK"
                },
                {
                    "name": "Al Bahr al Ahmar",
                    "abbreviation": "BA"
                },
                {
                    "name": "Al Buhayrah",
                    "abbreviation": "BH"
                },
                {
                    "name": "Al Fayym",
                    "abbreviation": "FYM"
                },
                {
                    "name": "Al Gharbiyah",
                    "abbreviation": "GH"
                },
                {
                    "name": "Al Iskandarlyah",
                    "abbreviation": "ALX"
                },
                {
                    "name": "Al Isma illyah",
                    "abbreviation": "IS"
                },
                {
                    "name": "Al Jizah",
                    "abbreviation": "GZ"
                },
                {
                    "name": "Al Minuflyah",
                    "abbreviation": "MNF"
                },
                {
                    "name": "Al Minya",
                    "abbreviation": "MN"
                },
                {
                    "name": "Al Qahirah",
                    "abbreviation": "C"
                },
                {
                    "name": "Al Qalyublyah",
                    "abbreviation": "KB"
                },
                {
                    "name": "Al Wadi al Jadid",
                    "abbreviation": "WAD"
                },
                {
                    "name": "Ash Sharqiyah",
                    "abbreviation": "SHR"
                },
                {
                    "name": "As Suways",
                    "abbreviation": "SUZ"
                },
                {
                    "name": "Aswan",
                    "abbreviation": "ASN"
                },
                {
                    "name": "Asyut",
                    "abbreviation": "AST"
                },
                {
                    "name": "Bani Suwayf",
                    "abbreviation": "BNS"
                },
                {
                    "name": "Bur Sa'id",
                    "abbreviation": "PTS"
                },
                {
                    "name": "Dumyat",
                    "abbreviation": "DT"
                },
                {
                    "name": "Janub Sina'",
                    "abbreviation": "JS"
                },
                {
                    "name": "Kafr ash Shaykh",
                    "abbreviation": "KFS"
                },
                {
                    "name": "Matruh",
                    "abbreviation": "MT"
                },
                {
                    "name": "Qina",
                    "abbreviation": "KN"
                },
                {
                    "name": "Shamal Sina'",
                    "abbreviation": "SIN"
                },
                {
                    "name": "Suhaj",
                    "abbreviation": "SHG"
                }
            ],
            "1066": [
                {
                    "name": "Ahuachapan",
                    "abbreviation": "AH"
                },
                {
                    "name": "Cabanas",
                    "abbreviation": "CA"
                },
                {
                    "name": "Cuscatlan",
                    "abbreviation": "CU"
                },
                {
                    "name": "Chalatenango",
                    "abbreviation": "CH"
                },
                {
                    "name": "Morazan",
                    "abbreviation": "MO"
                },
                {
                    "name": "San Miguel",
                    "abbreviation": "SM"
                },
                {
                    "name": "San Salvador",
                    "abbreviation": "SS"
                },
                {
                    "name": "Santa Ana",
                    "abbreviation": "SA"
                },
                {
                    "name": "San Vicente",
                    "abbreviation": "SV"
                },
                {
                    "name": "Sonsonate",
                    "abbreviation": "SO"
                },
                {
                    "name": "Usulutan",
                    "abbreviation": "US"
                }
            ],
            "1067": [
                {
                    "name": "Region Continental",
                    "abbreviation": "C"
                },
                {
                    "name": "Region Insular",
                    "abbreviation": "I"
                },
                {
                    "name": "Annobon",
                    "abbreviation": "AN"
                },
                {
                    "name": "Bioko Norte",
                    "abbreviation": "BN"
                },
                {
                    "name": "Bioko Sur",
                    "abbreviation": "BS"
                },
                {
                    "name": "Centro Sur",
                    "abbreviation": "CS"
                },
                {
                    "name": "Kie-Ntem",
                    "abbreviation": "KN"
                },
                {
                    "name": "Litoral",
                    "abbreviation": "LI"
                },
                {
                    "name": "Wele-Nzas",
                    "abbreviation": "WN"
                }
            ],
            "1068": [
                {
                    "name": "Anseba",
                    "abbreviation": "AN"
                },
                {
                    "name": "Debub",
                    "abbreviation": "DU"
                },
                {
                    "name": "Debubawi Keyih Bahri [Debub-Keih-Bahri]",
                    "abbreviation": "DK"
                },
                {
                    "name": "Gash-Barka",
                    "abbreviation": "GB"
                },
                {
                    "name": "Maakel [Maekel]",
                    "abbreviation": "MA"
                },
                {
                    "name": "Semenawi Keyih Bahri [Semien-Keih-Bahri]",
                    "abbreviation": "SK"
                }
            ],
            "1069": [
                {
                    "name": "Harjumsa",
                    "abbreviation": "37"
                },
                {
                    "name": "Hitumea",
                    "abbreviation": "39"
                },
                {
                    "name": "Ida-Virumsa",
                    "abbreviation": "44"
                },
                {
                    "name": "Jogevamsa",
                    "abbreviation": "49"
                },
                {
                    "name": "Jarvamsa",
                    "abbreviation": "51"
                },
                {
                    "name": "Lasnemsa",
                    "abbreviation": "57"
                },
                {
                    "name": "Laane-Virumaa",
                    "abbreviation": "59"
                },
                {
                    "name": "Polvamea",
                    "abbreviation": "65"
                },
                {
                    "name": "Parnumsa",
                    "abbreviation": "67"
                },
                {
                    "name": "Raplamsa",
                    "abbreviation": "70"
                },
                {
                    "name": "Saaremsa",
                    "abbreviation": "74"
                },
                {
                    "name": "Tartumsa",
                    "abbreviation": "7B"
                },
                {
                    "name": "Valgamaa",
                    "abbreviation": "82"
                },
                {
                    "name": "Viljandimsa",
                    "abbreviation": "84"
                },
                {
                    "name": "Vorumaa",
                    "abbreviation": "86"
                }
            ],
            "1070": [
                {
                    "name": "Addis Ababa",
                    "abbreviation": "AA"
                },
                {
                    "name": "Dire Dawa",
                    "abbreviation": "DD"
                },
                {
                    "name": "Afar",
                    "abbreviation": "AF"
                },
                {
                    "name": "Amara",
                    "abbreviation": "AM"
                },
                {
                    "name": "Benshangul-Gumaz",
                    "abbreviation": "BE"
                },
                {
                    "name": "Gambela Peoples",
                    "abbreviation": "GA"
                },
                {
                    "name": "Harari People",
                    "abbreviation": "HA"
                },
                {
                    "name": "Oromia",
                    "abbreviation": "OR"
                },
                {
                    "name": "Somali",
                    "abbreviation": "SO"
                },
                {
                    "name": "Southern Nations, Nationalities and Peoples",
                    "abbreviation": "SN"
                },
                {
                    "name": "Tigrai",
                    "abbreviation": "TI"
                }
            ],
            "1074": [
                {
                    "name": "Eastern",
                    "abbreviation": "E"
                },
                {
                    "name": "Northern",
                    "abbreviation": "N"
                },
                {
                    "name": "Western",
                    "abbreviation": "W"
                },
                {
                    "name": "Rotuma",
                    "abbreviation": "R"
                }
            ],
            "1075": [
                {
                    "name": "South Karelia",
                    "abbreviation": "SK"
                },
                {
                    "name": "South Ostrobothnia",
                    "abbreviation": "SO"
                },
                {
                    "name": "Etelä-Savo",
                    "abbreviation": "ES"
                },
                {
                    "name": "Häme",
                    "abbreviation": "HH"
                },
                {
                    "name": "Itä-Uusimaa",
                    "abbreviation": "IU"
                },
                {
                    "name": "Kainuu",
                    "abbreviation": "KA"
                },
                {
                    "name": "Central Ostrobothnia",
                    "abbreviation": "CO"
                },
                {
                    "name": "Central Finland",
                    "abbreviation": "CF"
                },
                {
                    "name": "Kymenlaakso",
                    "abbreviation": "KY"
                },
                {
                    "name": "Lapland",
                    "abbreviation": "LA"
                },
                {
                    "name": "Tampere Region",
                    "abbreviation": "TR"
                },
                {
                    "name": "Ostrobothnia",
                    "abbreviation": "OB"
                },
                {
                    "name": "North Karelia",
                    "abbreviation": "NK"
                },
                {
                    "name": "Nothern Ostrobothnia",
                    "abbreviation": "NO"
                },
                {
                    "name": "Northern Savo",
                    "abbreviation": "NS"
                },
                {
                    "name": "Päijät-Häme",
                    "abbreviation": "PH"
                },
                {
                    "name": "Satakunta",
                    "abbreviation": "SK"
                },
                {
                    "name": "Uusimaa",
                    "abbreviation": "UM"
                },
                {
                    "name": "South-West Finland",
                    "abbreviation": "SW"
                },
                {
                    "name": "Åland",
                    "abbreviation": "AL"
                }
            ],
            "1076": [
                {
                    "name": "Ain",
                    "abbreviation": "01"
                },
                {
                    "name": "Aisne",
                    "abbreviation": "02"
                },
                {
                    "name": "Allier",
                    "abbreviation": "03"
                },
                {
                    "name": "Alpes-de-Haute-Provence",
                    "abbreviation": "04"
                },
                {
                    "name": "Alpes-Maritimes",
                    "abbreviation": "06"
                },
                {
                    "name": "Ardèche",
                    "abbreviation": "07"
                },
                {
                    "name": "Ardennes",
                    "abbreviation": "08"
                },
                {
                    "name": "Ariège",
                    "abbreviation": "09"
                },
                {
                    "name": "Aube",
                    "abbreviation": "10"
                },
                {
                    "name": "Aude",
                    "abbreviation": "11"
                },
                {
                    "name": "Aveyron",
                    "abbreviation": "12"
                },
                {
                    "name": "Bas-Rhin",
                    "abbreviation": "67"
                },
                {
                    "name": "Bouches-du-Rhône",
                    "abbreviation": "13"
                },
                {
                    "name": "Calvados",
                    "abbreviation": "14"
                },
                {
                    "name": "Cantal",
                    "abbreviation": "15"
                },
                {
                    "name": "Charente",
                    "abbreviation": "16"
                },
                {
                    "name": "Charente-Maritime",
                    "abbreviation": "17"
                },
                {
                    "name": "Cher",
                    "abbreviation": "18"
                },
                {
                    "name": "Corrèze",
                    "abbreviation": "19"
                },
                {
                    "name": "Corse-du-Sud",
                    "abbreviation": "20A"
                },
                {
                    "name": "Côte-d'Or",
                    "abbreviation": "21"
                },
                {
                    "name": "Côtes-d'Armor",
                    "abbreviation": "22"
                },
                {
                    "name": "Creuse",
                    "abbreviation": "23"
                },
                {
                    "name": "Deux-Sèvres",
                    "abbreviation": "79"
                },
                {
                    "name": "Dordogne",
                    "abbreviation": "24"
                },
                {
                    "name": "Doubs",
                    "abbreviation": "25"
                },
                {
                    "name": "Drôme",
                    "abbreviation": "26"
                },
                {
                    "name": "Essonne",
                    "abbreviation": "91"
                },
                {
                    "name": "Eure",
                    "abbreviation": "27"
                },
                {
                    "name": "Eure-et-Loir",
                    "abbreviation": "28"
                },
                {
                    "name": "Finistère",
                    "abbreviation": "29"
                },
                {
                    "name": "Gard",
                    "abbreviation": "30"
                },
                {
                    "name": "Gers",
                    "abbreviation": "32"
                },
                {
                    "name": "Gironde",
                    "abbreviation": "33"
                },
                {
                    "name": "Haut-Rhin",
                    "abbreviation": "68"
                },
                {
                    "name": "Haute-Corse",
                    "abbreviation": "20B"
                },
                {
                    "name": "Haute-Garonne",
                    "abbreviation": "31"
                },
                {
                    "name": "Haute-Loire",
                    "abbreviation": "43"
                },
                {
                    "name": "Haute-Saône",
                    "abbreviation": "70"
                },
                {
                    "name": "Haute-Savoie",
                    "abbreviation": "74"
                },
                {
                    "name": "Haute-Vienne",
                    "abbreviation": "87"
                },
                {
                    "name": "Hautes-Alpes",
                    "abbreviation": "05"
                },
                {
                    "name": "Hautes-Pyrénées",
                    "abbreviation": "65"
                },
                {
                    "name": "Hauts-de-Seine",
                    "abbreviation": "92"
                },
                {
                    "name": "Hérault",
                    "abbreviation": "34"
                },
                {
                    "name": "Indre",
                    "abbreviation": "36"
                },
                {
                    "name": "Ille-et-Vilaine",
                    "abbreviation": "35"
                },
                {
                    "name": "Indre-et-Loire",
                    "abbreviation": "37"
                },
                {
                    "name": "Isère",
                    "abbreviation": "38"
                },
                {
                    "name": "Landes",
                    "abbreviation": "40"
                },
                {
                    "name": "Loir-et-Cher",
                    "abbreviation": "41"
                },
                {
                    "name": "Loire",
                    "abbreviation": "42"
                },
                {
                    "name": "Loire-Atlantique",
                    "abbreviation": "44"
                },
                {
                    "name": "Loiret",
                    "abbreviation": "45"
                },
                {
                    "name": "Lot",
                    "abbreviation": "46"
                },
                {
                    "name": "Lot-et-Garonne",
                    "abbreviation": "47"
                },
                {
                    "name": "Lozère",
                    "abbreviation": "48"
                },
                {
                    "name": "Maine-et-Loire",
                    "abbreviation": "49"
                },
                {
                    "name": "Manche",
                    "abbreviation": "50"
                },
                {
                    "name": "Marne",
                    "abbreviation": "51"
                },
                {
                    "name": "Mayenne",
                    "abbreviation": "53"
                },
                {
                    "name": "Meurthe-et-Moselle",
                    "abbreviation": "54"
                },
                {
                    "name": "Meuse",
                    "abbreviation": "55"
                },
                {
                    "name": "Morbihan",
                    "abbreviation": "56"
                },
                {
                    "name": "Moselle",
                    "abbreviation": "57"
                },
                {
                    "name": "Nièvre",
                    "abbreviation": "58"
                },
                {
                    "name": "Nord",
                    "abbreviation": "59"
                },
                {
                    "name": "Oise",
                    "abbreviation": "60"
                },
                {
                    "name": "Orne",
                    "abbreviation": "61"
                },
                {
                    "name": "Paris",
                    "abbreviation": "75"
                },
                {
                    "name": "Pas-de-Calais",
                    "abbreviation": "62"
                },
                {
                    "name": "Puy-de-Dôme",
                    "abbreviation": "63"
                },
                {
                    "name": "Pyrénées-Atlantiques",
                    "abbreviation": "64"
                },
                {
                    "name": "Pyrénées-Orientales",
                    "abbreviation": "66"
                },
                {
                    "name": "Rhône",
                    "abbreviation": "69"
                },
                {
                    "name": "Saône-et-Loire",
                    "abbreviation": "71"
                },
                {
                    "name": "Sarthe",
                    "abbreviation": "72"
                },
                {
                    "name": "Savoie",
                    "abbreviation": "73"
                },
                {
                    "name": "Seine-et-Marne",
                    "abbreviation": "77"
                },
                {
                    "name": "Seine-Maritime",
                    "abbreviation": "76"
                },
                {
                    "name": "Seine-Saint-Denis",
                    "abbreviation": "93"
                },
                {
                    "name": "Somme",
                    "abbreviation": "80"
                },
                {
                    "name": "Tarn",
                    "abbreviation": "81"
                },
                {
                    "name": "Tarn-et-Garonne",
                    "abbreviation": "82"
                },
                {
                    "name": "Val d'Oise",
                    "abbreviation": "95"
                },
                {
                    "name": "Territoire de Belfort",
                    "abbreviation": "90"
                },
                {
                    "name": "Val-de-Marne",
                    "abbreviation": "94"
                },
                {
                    "name": "Var",
                    "abbreviation": "83"
                },
                {
                    "name": "Vaucluse",
                    "abbreviation": "84"
                },
                {
                    "name": "Vendée",
                    "abbreviation": "85"
                },
                {
                    "name": "Vienne",
                    "abbreviation": "86"
                },
                {
                    "name": "Vosges",
                    "abbreviation": "88"
                },
                {
                    "name": "Yonne",
                    "abbreviation": "89"
                },
                {
                    "name": "Yvelines",
                    "abbreviation": "78"
                },
                {
                    "name": "Jura",
                    "abbreviation": "39"
                }
            ],
            "1082": [
                {
                    "name": "Baden-Wuerttemberg",
                    "abbreviation": "BW"
                },
                {
                    "name": "Bayern",
                    "abbreviation": "BY"
                },
                {
                    "name": "Bremen",
                    "abbreviation": "HB"
                },
                {
                    "name": "Hamburg",
                    "abbreviation": "HH"
                },
                {
                    "name": "Hessen",
                    "abbreviation": "HE"
                },
                {
                    "name": "Niedersachsen",
                    "abbreviation": "NI"
                },
                {
                    "name": "Nordrhein-Westfalen",
                    "abbreviation": "NW"
                },
                {
                    "name": "Rheinland-Pfalz",
                    "abbreviation": "RP"
                },
                {
                    "name": "Saarland",
                    "abbreviation": "SL"
                },
                {
                    "name": "Schleswig-Holstein",
                    "abbreviation": "SH"
                },
                {
                    "name": "Berlin",
                    "abbreviation": "BR"
                },
                {
                    "name": "Brandenburg",
                    "abbreviation": "BB"
                },
                {
                    "name": "Mecklenburg-Vorpommern",
                    "abbreviation": "MV"
                },
                {
                    "name": "Sachsen",
                    "abbreviation": "SN"
                },
                {
                    "name": "Sachsen-Anhalt",
                    "abbreviation": "ST"
                },
                {
                    "name": "Thueringen",
                    "abbreviation": "TH"
                }
            ],
            "1083": [
                {
                    "name": "Ashanti",
                    "abbreviation": "AH"
                },
                {
                    "name": "Brong-Ahafo",
                    "abbreviation": "BA"
                },
                {
                    "name": "Greater Accra",
                    "abbreviation": "AA"
                },
                {
                    "name": "Upper East",
                    "abbreviation": "UE"
                },
                {
                    "name": "Upper West",
                    "abbreviation": "UW"
                },
                {
                    "name": "Volta",
                    "abbreviation": "TV"
                }
            ],
            "1085": [
                {
                    "name": "Achaïa",
                    "abbreviation": "13"
                },
                {
                    "name": "Aitolia-Akarnania",
                    "abbreviation": "01"
                },
                {
                    "name": "Argolis",
                    "abbreviation": "11"
                },
                {
                    "name": "Arkadia",
                    "abbreviation": "12"
                },
                {
                    "name": "Arta",
                    "abbreviation": "31"
                },
                {
                    "name": "Attiki",
                    "abbreviation": "A1"
                },
                {
                    "name": "Chalkidiki",
                    "abbreviation": "64"
                },
                {
                    "name": "Chania",
                    "abbreviation": "94"
                },
                {
                    "name": "Chios",
                    "abbreviation": "85"
                },
                {
                    "name": "Dodekanisos",
                    "abbreviation": "81"
                },
                {
                    "name": "Drama",
                    "abbreviation": "52"
                },
                {
                    "name": "Evros",
                    "abbreviation": "71"
                },
                {
                    "name": "Evrytania",
                    "abbreviation": "05"
                },
                {
                    "name": "Evvoia",
                    "abbreviation": "04"
                },
                {
                    "name": "Florina",
                    "abbreviation": "63"
                },
                {
                    "name": "Fokis",
                    "abbreviation": "07"
                },
                {
                    "name": "Fthiotis",
                    "abbreviation": "06"
                },
                {
                    "name": "Grevena",
                    "abbreviation": "51"
                },
                {
                    "name": "Ileia",
                    "abbreviation": "14"
                },
                {
                    "name": "Imathia",
                    "abbreviation": "53"
                },
                {
                    "name": "Ioannina",
                    "abbreviation": "33"
                },
                {
                    "name": "Irakleion",
                    "abbreviation": "91"
                },
                {
                    "name": "Karditsa",
                    "abbreviation": "41"
                },
                {
                    "name": "Kastoria",
                    "abbreviation": "56"
                },
                {
                    "name": "Kavalla",
                    "abbreviation": "55"
                },
                {
                    "name": "Kefallinia",
                    "abbreviation": "23"
                },
                {
                    "name": "Kerkyra",
                    "abbreviation": "22"
                },
                {
                    "name": "Kilkis",
                    "abbreviation": "57"
                },
                {
                    "name": "Korinthia",
                    "abbreviation": "15"
                },
                {
                    "name": "Kozani",
                    "abbreviation": "58"
                },
                {
                    "name": "Kyklades",
                    "abbreviation": "82"
                },
                {
                    "name": "Lakonia",
                    "abbreviation": "16"
                },
                {
                    "name": "Larisa",
                    "abbreviation": "42"
                },
                {
                    "name": "Lasithion",
                    "abbreviation": "92"
                },
                {
                    "name": "Lefkas",
                    "abbreviation": "24"
                },
                {
                    "name": "Lesvos",
                    "abbreviation": "83"
                },
                {
                    "name": "Magnisia",
                    "abbreviation": "43"
                },
                {
                    "name": "Messinia",
                    "abbreviation": "17"
                },
                {
                    "name": "Pella",
                    "abbreviation": "59"
                },
                {
                    "name": "Preveza",
                    "abbreviation": "34"
                },
                {
                    "name": "Rethymnon",
                    "abbreviation": "93"
                },
                {
                    "name": "Rodopi",
                    "abbreviation": "73"
                },
                {
                    "name": "Samos",
                    "abbreviation": "84"
                },
                {
                    "name": "Serrai",
                    "abbreviation": "62"
                },
                {
                    "name": "Thesprotia",
                    "abbreviation": "32"
                },
                {
                    "name": "Thessaloniki",
                    "abbreviation": "54"
                },
                {
                    "name": "Trikala",
                    "abbreviation": "44"
                },
                {
                    "name": "Voiotia",
                    "abbreviation": "03"
                },
                {
                    "name": "Xanthi",
                    "abbreviation": "72"
                },
                {
                    "name": "Zakynthos",
                    "abbreviation": "21"
                },
                {
                    "name": "Agio Oros",
                    "abbreviation": "69"
                }
            ],
            "1090": [
                {
                    "name": "Alta Verapez",
                    "abbreviation": "AV"
                },
                {
                    "name": "Baja Verapez",
                    "abbreviation": "BV"
                },
                {
                    "name": "Chimaltenango",
                    "abbreviation": "CM"
                },
                {
                    "name": "Chiquimula",
                    "abbreviation": "CQ"
                },
                {
                    "name": "El Progreso",
                    "abbreviation": "PR"
                },
                {
                    "name": "Escuintla",
                    "abbreviation": "ES"
                },
                {
                    "name": "Guatemala",
                    "abbreviation": "GU"
                },
                {
                    "name": "Huehuetenango",
                    "abbreviation": "HU"
                },
                {
                    "name": "Izabal",
                    "abbreviation": "IZ"
                },
                {
                    "name": "Jalapa",
                    "abbreviation": "JA"
                },
                {
                    "name": "Jutiapa",
                    "abbreviation": "JU"
                },
                {
                    "name": "Peten",
                    "abbreviation": "PE"
                },
                {
                    "name": "Quetzaltenango",
                    "abbreviation": "QZ"
                },
                {
                    "name": "Quiche",
                    "abbreviation": "QC"
                },
                {
                    "name": "Reta.thuleu",
                    "abbreviation": "RE"
                },
                {
                    "name": "Sacatepequez",
                    "abbreviation": "SA"
                },
                {
                    "name": "San Marcos",
                    "abbreviation": "SM"
                },
                {
                    "name": "Santa Rosa",
                    "abbreviation": "SR"
                },
                {
                    "name": "Solol6",
                    "abbreviation": "SO"
                },
                {
                    "name": "Suchitepequez",
                    "abbreviation": "SU"
                },
                {
                    "name": "Totonicapan",
                    "abbreviation": "TO"
                },
                {
                    "name": "Zacapa",
                    "abbreviation": "ZA"
                }
            ],
            "1091": [
                {
                    "name": "Beyla",
                    "abbreviation": "BE"
                },
                {
                    "name": "Boffa",
                    "abbreviation": "BF"
                },
                {
                    "name": "Boke",
                    "abbreviation": "BK"
                },
                {
                    "name": "Coyah",
                    "abbreviation": "CO"
                },
                {
                    "name": "Dabola",
                    "abbreviation": "DB"
                },
                {
                    "name": "Dalaba",
                    "abbreviation": "DL"
                },
                {
                    "name": "Dinguiraye",
                    "abbreviation": "DI"
                },
                {
                    "name": "Dubreka",
                    "abbreviation": "DU"
                },
                {
                    "name": "Faranah",
                    "abbreviation": "FA"
                },
                {
                    "name": "Forecariah",
                    "abbreviation": "FO"
                },
                {
                    "name": "Fria",
                    "abbreviation": "FR"
                },
                {
                    "name": "Gaoual",
                    "abbreviation": "GA"
                },
                {
                    "name": "Guekedou",
                    "abbreviation": "GU"
                },
                {
                    "name": "Kankan",
                    "abbreviation": "KA"
                },
                {
                    "name": "Kerouane",
                    "abbreviation": "KE"
                },
                {
                    "name": "Kindia",
                    "abbreviation": "KD"
                },
                {
                    "name": "Kissidougou",
                    "abbreviation": "KS"
                },
                {
                    "name": "Koubia",
                    "abbreviation": "KB"
                },
                {
                    "name": "Koundara",
                    "abbreviation": "KN"
                },
                {
                    "name": "Kouroussa",
                    "abbreviation": "KO"
                },
                {
                    "name": "Labe",
                    "abbreviation": "LA"
                },
                {
                    "name": "Lelouma",
                    "abbreviation": "LE"
                },
                {
                    "name": "Lola",
                    "abbreviation": "LO"
                },
                {
                    "name": "Macenta",
                    "abbreviation": "MC"
                },
                {
                    "name": "Mali",
                    "abbreviation": "ML"
                },
                {
                    "name": "Mamou",
                    "abbreviation": "MM"
                },
                {
                    "name": "Mandiana",
                    "abbreviation": "MD"
                },
                {
                    "name": "Nzerekore",
                    "abbreviation": "NZ"
                },
                {
                    "name": "Pita",
                    "abbreviation": "PI"
                },
                {
                    "name": "Siguiri",
                    "abbreviation": "SI"
                },
                {
                    "name": "Telimele",
                    "abbreviation": "TE"
                },
                {
                    "name": "Tougue",
                    "abbreviation": "TO"
                },
                {
                    "name": "Yomou",
                    "abbreviation": "YO"
                }
            ],
            "1092": [
                {
                    "name": "Bissau",
                    "abbreviation": "BS"
                },
                {
                    "name": "Bafata",
                    "abbreviation": "BA"
                },
                {
                    "name": "Biombo",
                    "abbreviation": "BM"
                },
                {
                    "name": "Bolama",
                    "abbreviation": "BL"
                },
                {
                    "name": "Cacheu",
                    "abbreviation": "CA"
                },
                {
                    "name": "Gabu",
                    "abbreviation": "GA"
                },
                {
                    "name": "Oio",
                    "abbreviation": "OI"
                },
                {
                    "name": "Quloara",
                    "abbreviation": "QU"
                },
                {
                    "name": "Tombali S",
                    "abbreviation": "TO"
                }
            ],
            "1093": [
                {
                    "name": "Barima-Waini",
                    "abbreviation": "BA"
                },
                {
                    "name": "Cuyuni-Mazaruni",
                    "abbreviation": "CU"
                },
                {
                    "name": "Demerara-Mahaica",
                    "abbreviation": "DE"
                },
                {
                    "name": "East Berbice-Corentyne",
                    "abbreviation": "EB"
                },
                {
                    "name": "Essequibo Islands-West Demerara",
                    "abbreviation": "ES"
                },
                {
                    "name": "Mahaica-Berbice",
                    "abbreviation": "MA"
                },
                {
                    "name": "Pomeroon-Supenaam",
                    "abbreviation": "PM"
                },
                {
                    "name": "Potaro-Siparuni",
                    "abbreviation": "PT"
                },
                {
                    "name": "Upper Demerara-Berbice",
                    "abbreviation": "UD"
                },
                {
                    "name": "Upper Takutu-Upper Essequibo",
                    "abbreviation": "UT"
                }
            ],
            "1094": [
                {
                    "name": "Grande-Anse",
                    "abbreviation": "GA"
                },
                {
                    "name": "Nord-Est",
                    "abbreviation": "NE"
                },
                {
                    "name": "Nord-Ouest",
                    "abbreviation": "NO"
                },
                {
                    "name": "Ouest",
                    "abbreviation": "OU"
                },
                {
                    "name": "Sud",
                    "abbreviation": "SD"
                },
                {
                    "name": "Sud-Est",
                    "abbreviation": "SE"
                },
                {
                    "name": "Artibonite",
                    "abbreviation": "AR"
                },
                {
                    "name": "Centre",
                    "abbreviation": "CE"
                },
                {
                    "name": "Nippes",
                    "abbreviation": "NI"
                },
                {
                    "name": "Nord",
                    "abbreviation": "ND"
                }
            ],
            "1097": [
                {
                    "name": "Atlantida",
                    "abbreviation": "AT"
                },
                {
                    "name": "Colon",
                    "abbreviation": "CL"
                },
                {
                    "name": "Comayagua",
                    "abbreviation": "CM"
                },
                {
                    "name": "Copan",
                    "abbreviation": "CP"
                },
                {
                    "name": "Cortes",
                    "abbreviation": "CR"
                },
                {
                    "name": "Choluteca",
                    "abbreviation": "CH"
                },
                {
                    "name": "El Paraiso",
                    "abbreviation": "EP"
                },
                {
                    "name": "Francisco Morazan",
                    "abbreviation": "FM"
                },
                {
                    "name": "Gracias a Dios",
                    "abbreviation": "GD"
                },
                {
                    "name": "Intibuca",
                    "abbreviation": "IN"
                },
                {
                    "name": "Islas de la Bahia",
                    "abbreviation": "IB"
                },
                {
                    "name": "Lempira",
                    "abbreviation": "LE"
                },
                {
                    "name": "Ocotepeque",
                    "abbreviation": "OC"
                },
                {
                    "name": "Olancho",
                    "abbreviation": "OL"
                },
                {
                    "name": "Santa Barbara",
                    "abbreviation": "SB"
                },
                {
                    "name": "Valle",
                    "abbreviation": "VA"
                },
                {
                    "name": "Yoro",
                    "abbreviation": "YO"
                }
            ],
            "1098": [
                {
                    "name": "Central and Western",
                    "abbreviation": "CW"
                },
                {
                    "name": "Eastern",
                    "abbreviation": "EA"
                },
                {
                    "name": "Southern",
                    "abbreviation": "SO"
                },
                {
                    "name": "Wan Chai",
                    "abbreviation": "WC"
                },
                {
                    "name": "Kowloon City",
                    "abbreviation": "KC"
                },
                {
                    "name": "Kwun Tong",
                    "abbreviation": "KU"
                },
                {
                    "name": "Sham Shui Po",
                    "abbreviation": "SS"
                },
                {
                    "name": "Wong Tai Sin",
                    "abbreviation": "WT"
                },
                {
                    "name": "Yau Tsim Mong",
                    "abbreviation": "YT"
                },
                {
                    "name": "Islands",
                    "abbreviation": "IS"
                },
                {
                    "name": "Kwai Tsing",
                    "abbreviation": "KI"
                },
                {
                    "name": "North",
                    "abbreviation": "NO"
                },
                {
                    "name": "Sai Kung",
                    "abbreviation": "SK"
                },
                {
                    "name": "Sha Tin",
                    "abbreviation": "ST"
                },
                {
                    "name": "Tai Po",
                    "abbreviation": "TP"
                },
                {
                    "name": "Tsuen Wan",
                    "abbreviation": "TW"
                },
                {
                    "name": "Tuen Mun",
                    "abbreviation": "TM"
                },
                {
                    "name": "Yuen Long",
                    "abbreviation": "YL"
                }
            ],
            "1099": [
                {
                    "name": "Budapest",
                    "abbreviation": "BU"
                },
                {
                    "name": "Bács-Kiskun",
                    "abbreviation": "BK"
                },
                {
                    "name": "Baranya",
                    "abbreviation": "BA"
                },
                {
                    "name": "Békés",
                    "abbreviation": "BE"
                },
                {
                    "name": "Borsod-Abaúj-Zemplén",
                    "abbreviation": "BZ"
                },
                {
                    "name": "Csongrád",
                    "abbreviation": "CS"
                },
                {
                    "name": "Fejér",
                    "abbreviation": "FE"
                },
                {
                    "name": "Győr-Moson-Sopron",
                    "abbreviation": "GS"
                },
                {
                    "name": "Hajdu-Bihar",
                    "abbreviation": "HB"
                },
                {
                    "name": "Heves",
                    "abbreviation": "HE"
                },
                {
                    "name": "Jász-Nagykun-Szolnok",
                    "abbreviation": "JN"
                },
                {
                    "name": "Komárom-Esztergom",
                    "abbreviation": "KE"
                },
                {
                    "name": "Nográd",
                    "abbreviation": "NO"
                },
                {
                    "name": "Pest",
                    "abbreviation": "PE"
                },
                {
                    "name": "Somogy",
                    "abbreviation": "SO"
                },
                {
                    "name": "Szabolcs-Szatmár-Bereg",
                    "abbreviation": "SZ"
                },
                {
                    "name": "Tolna",
                    "abbreviation": "TO"
                },
                {
                    "name": "Vas",
                    "abbreviation": "VA"
                },
                {
                    "name": "Veszprém",
                    "abbreviation": "VE"
                },
                {
                    "name": "Zala",
                    "abbreviation": "ZA"
                },
                {
                    "name": "Békéscsaba",
                    "abbreviation": "BC"
                },
                {
                    "name": "Debrecen",
                    "abbreviation": "DE"
                },
                {
                    "name": "Dunaújváros",
                    "abbreviation": "DU"
                },
                {
                    "name": "Eger",
                    "abbreviation": "EG"
                },
                {
                    "name": "Győr",
                    "abbreviation": "GY"
                },
                {
                    "name": "Hódmezővásárhely",
                    "abbreviation": "HV"
                },
                {
                    "name": "Kaposvár",
                    "abbreviation": "KV"
                },
                {
                    "name": "Kecskemét",
                    "abbreviation": "KM"
                },
                {
                    "name": "Miskolc",
                    "abbreviation": "MI"
                },
                {
                    "name": "Nagykanizsa",
                    "abbreviation": "NK"
                },
                {
                    "name": "Nyiregyháza",
                    "abbreviation": "NY"
                },
                {
                    "name": "Pécs",
                    "abbreviation": "PS"
                },
                {
                    "name": "Salgótarján",
                    "abbreviation": "ST"
                },
                {
                    "name": "Sopron",
                    "abbreviation": "SN"
                },
                {
                    "name": "Szeged",
                    "abbreviation": "SD"
                },
                {
                    "name": "Székesfehérvár",
                    "abbreviation": "SF"
                },
                {
                    "name": "Szekszárd",
                    "abbreviation": "SS"
                },
                {
                    "name": "Szolnok",
                    "abbreviation": "SK"
                },
                {
                    "name": "Szombathely",
                    "abbreviation": "SH"
                },
                {
                    "name": "Tatabánya",
                    "abbreviation": "TB"
                },
                {
                    "name": "Zalaegerszeg",
                    "abbreviation": "ZE"
                }
            ],
            "1100": [
                {
                    "name": "Austurland",
                    "abbreviation": "7"
                },
                {
                    "name": "Hofuoborgarsvaeoi utan Reykjavikur",
                    "abbreviation": "1"
                },
                {
                    "name": "Norourland eystra",
                    "abbreviation": "6"
                },
                {
                    "name": "Norourland vestra",
                    "abbreviation": "5"
                },
                {
                    "name": "Reykjavik",
                    "abbreviation": "0"
                },
                {
                    "name": "Suourland",
                    "abbreviation": "8"
                },
                {
                    "name": "Suournes",
                    "abbreviation": "2"
                },
                {
                    "name": "Vestfirolr",
                    "abbreviation": "4"
                },
                {
                    "name": "Vesturland",
                    "abbreviation": "3"
                }
            ],
            "1101": [
                {
                    "name": "Maharashtra",
                    "abbreviation": "MM"
                },
                {
                    "name": "Karnataka",
                    "abbreviation": "KA"
                },
                {
                    "name": "Andhra Pradesh",
                    "abbreviation": "AP"
                },
                {
                    "name": "Arunachal Pradesh",
                    "abbreviation": "AR"
                },
                {
                    "name": "Assam",
                    "abbreviation": "AS"
                },
                {
                    "name": "Bihar",
                    "abbreviation": "BR"
                },
                {
                    "name": "Chhattisgarh",
                    "abbreviation": "CH"
                },
                {
                    "name": "Goa",
                    "abbreviation": "GA"
                },
                {
                    "name": "Gujarat",
                    "abbreviation": "GJ"
                },
                {
                    "name": "Haryana",
                    "abbreviation": "HR"
                },
                {
                    "name": "Himachal Pradesh",
                    "abbreviation": "HP"
                },
                {
                    "name": "Jammu and Kashmir",
                    "abbreviation": "JK"
                },
                {
                    "name": "Jharkhand",
                    "abbreviation": "JH"
                },
                {
                    "name": "Kerala",
                    "abbreviation": "KL"
                },
                {
                    "name": "Madhya Pradesh",
                    "abbreviation": "MP"
                },
                {
                    "name": "Manipur",
                    "abbreviation": "MN"
                },
                {
                    "name": "Meghalaya",
                    "abbreviation": "ML"
                },
                {
                    "name": "Mizoram",
                    "abbreviation": "MZ"
                },
                {
                    "name": "Nagaland",
                    "abbreviation": "NL"
                },
                {
                    "name": "Orissa",
                    "abbreviation": "OR"
                },
                {
                    "name": "Punjab",
                    "abbreviation": "PB"
                },
                {
                    "name": "Rajasthan",
                    "abbreviation": "RJ"
                },
                {
                    "name": "Sikkim",
                    "abbreviation": "SK"
                },
                {
                    "name": "Tamil Nadu",
                    "abbreviation": "TN"
                },
                {
                    "name": "Tripura",
                    "abbreviation": "TR"
                },
                {
                    "name": "Uttaranchal",
                    "abbreviation": "UL"
                },
                {
                    "name": "Uttar Pradesh",
                    "abbreviation": "UP"
                },
                {
                    "name": "West Bengal",
                    "abbreviation": "WB"
                },
                {
                    "name": "Andaman and Nicobar Islands",
                    "abbreviation": "AN"
                },
                {
                    "name": "Dadra and Nagar Haveli",
                    "abbreviation": "DN"
                },
                {
                    "name": "Daman and Diu",
                    "abbreviation": "DD"
                },
                {
                    "name": "Delhi",
                    "abbreviation": "DL"
                },
                {
                    "name": "Lakshadweep",
                    "abbreviation": "LD"
                },
                {
                    "name": "Pondicherry",
                    "abbreviation": "PY"
                }
            ],
            "1102": [
                {
                    "name": "Bali",
                    "abbreviation": "BA"
                },
                {
                    "name": "Bangka Belitung",
                    "abbreviation": "BB"
                },
                {
                    "name": "Banten",
                    "abbreviation": "BT"
                },
                {
                    "name": "Bengkulu",
                    "abbreviation": "BE"
                },
                {
                    "name": "Gorontalo",
                    "abbreviation": "GO"
                },
                {
                    "name": "Irian Jaya",
                    "abbreviation": "IJ"
                },
                {
                    "name": "Jambi",
                    "abbreviation": "JA"
                },
                {
                    "name": "Jawa Barat",
                    "abbreviation": "JB"
                },
                {
                    "name": "Jawa Tengah",
                    "abbreviation": "JT"
                },
                {
                    "name": "Jawa Timur",
                    "abbreviation": "JI"
                },
                {
                    "name": "Kalimantan Barat",
                    "abbreviation": "KB"
                },
                {
                    "name": "Kalimantan Timur",
                    "abbreviation": "KT"
                },
                {
                    "name": "Kalimantan Selatan",
                    "abbreviation": "KS"
                },
                {
                    "name": "Kepulauan Riau",
                    "abbreviation": "KR"
                },
                {
                    "name": "Lampung",
                    "abbreviation": "LA"
                },
                {
                    "name": "Maluku",
                    "abbreviation": "MA"
                },
                {
                    "name": "Maluku Utara",
                    "abbreviation": "MU"
                },
                {
                    "name": "Nusa Tenggara Barat",
                    "abbreviation": "NB"
                },
                {
                    "name": "Nusa Tenggara Timur",
                    "abbreviation": "NT"
                },
                {
                    "name": "Papua",
                    "abbreviation": "PA"
                },
                {
                    "name": "Riau",
                    "abbreviation": "RI"
                },
                {
                    "name": "Sulawesi Selatan",
                    "abbreviation": "SN"
                },
                {
                    "name": "Sulawesi Tengah",
                    "abbreviation": "ST"
                },
                {
                    "name": "Sulawesi Tenggara",
                    "abbreviation": "SG"
                },
                {
                    "name": "Sulawesi Utara",
                    "abbreviation": "SA"
                },
                {
                    "name": "Sumatra Barat",
                    "abbreviation": "SB"
                },
                {
                    "name": "Sumatra Selatan",
                    "abbreviation": "SS"
                },
                {
                    "name": "Sumatera Utara",
                    "abbreviation": "SU"
                },
                {
                    "name": "Jakarta Raya",
                    "abbreviation": "JK"
                },
                {
                    "name": "Aceh",
                    "abbreviation": "AC"
                },
                {
                    "name": "Yogyakarta",
                    "abbreviation": "YO"
                }
            ],
            "1103": [
                {
                    "name": "Ardabil",
                    "abbreviation": "03"
                },
                {
                    "name": "Azarbayjan-e Gharbi",
                    "abbreviation": "02"
                },
                {
                    "name": "Azarbayjan-e Sharqi",
                    "abbreviation": "01"
                },
                {
                    "name": "Bushehr",
                    "abbreviation": "06"
                },
                {
                    "name": "Chahar Mahall va Bakhtiari",
                    "abbreviation": "08"
                },
                {
                    "name": "Esfahan",
                    "abbreviation": "04"
                },
                {
                    "name": "Fars",
                    "abbreviation": "14"
                },
                {
                    "name": "Gilan",
                    "abbreviation": "19"
                },
                {
                    "name": "Golestan",
                    "abbreviation": "27"
                },
                {
                    "name": "Hamadan",
                    "abbreviation": "24"
                },
                {
                    "name": "Hormozgan",
                    "abbreviation": "23"
                },
                {
                    "name": "Iiam",
                    "abbreviation": "05"
                },
                {
                    "name": "Kerman",
                    "abbreviation": "15"
                },
                {
                    "name": "Kermanshah",
                    "abbreviation": "17"
                },
                {
                    "name": "Khorasan",
                    "abbreviation": "09"
                },
                {
                    "name": "Khuzestan",
                    "abbreviation": "10"
                },
                {
                    "name": "Kohjiluyeh va Buyer Ahmad",
                    "abbreviation": "18"
                },
                {
                    "name": "Kordestan",
                    "abbreviation": "16"
                },
                {
                    "name": "Lorestan",
                    "abbreviation": "20"
                },
                {
                    "name": "Markazi",
                    "abbreviation": "22"
                },
                {
                    "name": "Mazandaran",
                    "abbreviation": "21"
                },
                {
                    "name": "Qazvin",
                    "abbreviation": "28"
                },
                {
                    "name": "Qom",
                    "abbreviation": "26"
                },
                {
                    "name": "Semnan",
                    "abbreviation": "12"
                },
                {
                    "name": "Sistan va Baluchestan",
                    "abbreviation": "13"
                },
                {
                    "name": "Tehran",
                    "abbreviation": "07"
                },
                {
                    "name": "Yazd",
                    "abbreviation": "25"
                },
                {
                    "name": "Zanjan",
                    "abbreviation": "11"
                }
            ],
            "1104": [
                {
                    "name": "Al Anbar",
                    "abbreviation": "AN"
                },
                {
                    "name": "Al Ba,rah",
                    "abbreviation": "BA"
                },
                {
                    "name": "Al Muthanna",
                    "abbreviation": "MU"
                },
                {
                    "name": "Al Qadisiyah",
                    "abbreviation": "QA"
                },
                {
                    "name": "An Najef",
                    "abbreviation": "NA"
                },
                {
                    "name": "Arbil",
                    "abbreviation": "AR"
                },
                {
                    "name": "As Sulaymaniyah",
                    "abbreviation": "SW"
                },
                {
                    "name": "At Ta'mim",
                    "abbreviation": "TS"
                },
                {
                    "name": "Babil",
                    "abbreviation": "BB"
                },
                {
                    "name": "Baghdad",
                    "abbreviation": "BG"
                },
                {
                    "name": "Dahuk",
                    "abbreviation": "DA"
                },
                {
                    "name": "Dhi Qar",
                    "abbreviation": "DQ"
                },
                {
                    "name": "Diyala",
                    "abbreviation": "DI"
                },
                {
                    "name": "Karbala'",
                    "abbreviation": "KA"
                },
                {
                    "name": "Maysan",
                    "abbreviation": "MA"
                },
                {
                    "name": "Ninawa",
                    "abbreviation": "NI"
                },
                {
                    "name": "Salah ad Din",
                    "abbreviation": "SD"
                },
                {
                    "name": "Wasit",
                    "abbreviation": "WA"
                }
            ],
            "1105": [
                {
                    "name": "Cork",
                    "abbreviation": "C"
                },
                {
                    "name": "Clare",
                    "abbreviation": "CE"
                },
                {
                    "name": "Cavan",
                    "abbreviation": "CN"
                },
                {
                    "name": "Carlow",
                    "abbreviation": "CW"
                },
                {
                    "name": "Dublin",
                    "abbreviation": "D"
                },
                {
                    "name": "Donegal",
                    "abbreviation": "DL"
                },
                {
                    "name": "Galway",
                    "abbreviation": "G"
                },
                {
                    "name": "Kildare",
                    "abbreviation": "KE"
                },
                {
                    "name": "Kilkenny",
                    "abbreviation": "KK"
                },
                {
                    "name": "Kerry",
                    "abbreviation": "KY"
                },
                {
                    "name": "Longford",
                    "abbreviation": "LD"
                },
                {
                    "name": "Louth",
                    "abbreviation": "LH"
                },
                {
                    "name": "Limerick",
                    "abbreviation": "LK"
                },
                {
                    "name": "Leitrim",
                    "abbreviation": "LM"
                },
                {
                    "name": "Laois",
                    "abbreviation": "LS"
                },
                {
                    "name": "Meath",
                    "abbreviation": "MH"
                },
                {
                    "name": "Monaghan",
                    "abbreviation": "MN"
                },
                {
                    "name": "Mayo",
                    "abbreviation": "MO"
                },
                {
                    "name": "Offaly",
                    "abbreviation": "OY"
                },
                {
                    "name": "Roscommon",
                    "abbreviation": "RN"
                },
                {
                    "name": "Sligo",
                    "abbreviation": "SO"
                },
                {
                    "name": "Tipperary",
                    "abbreviation": "TA"
                },
                {
                    "name": "Waterford",
                    "abbreviation": "WD"
                },
                {
                    "name": "Westmeath",
                    "abbreviation": "WH"
                },
                {
                    "name": "Wicklow",
                    "abbreviation": "WW"
                },
                {
                    "name": "Wexford",
                    "abbreviation": "WX"
                }
            ],
            "1106": [
                {
                    "name": "HaDarom",
                    "abbreviation": "D"
                },
                {
                    "name": "HaMerkaz",
                    "abbreviation": "M"
                },
                {
                    "name": "HaZafon",
                    "abbreviation": "Z"
                },
                {
                    "name": "Haifa",
                    "abbreviation": "HA"
                },
                {
                    "name": "Tel-Aviv",
                    "abbreviation": "TA"
                },
                {
                    "name": "Jerusalem",
                    "abbreviation": "JM"
                }
            ],
            "1107": [
                {
                    "name": "Agrigento",
                    "abbreviation": "AG"
                },
                {
                    "name": "Alessandria",
                    "abbreviation": "AL"
                },
                {
                    "name": "Ancona",
                    "abbreviation": "AN"
                },
                {
                    "name": "Aosta",
                    "abbreviation": "AO"
                },
                {
                    "name": "Arezzo",
                    "abbreviation": "AR"
                },
                {
                    "name": "Ascoli Piceno",
                    "abbreviation": "AP"
                },
                {
                    "name": "Asti",
                    "abbreviation": "AT"
                },
                {
                    "name": "Avellino",
                    "abbreviation": "AV"
                },
                {
                    "name": "Bari",
                    "abbreviation": "BA"
                },
                {
                    "name": "Belluno",
                    "abbreviation": "BL"
                },
                {
                    "name": "Benevento",
                    "abbreviation": "BN"
                },
                {
                    "name": "Bergamo",
                    "abbreviation": "BG"
                },
                {
                    "name": "Biella",
                    "abbreviation": "BI"
                },
                {
                    "name": "Bologna",
                    "abbreviation": "BO"
                },
                {
                    "name": "Bolzano",
                    "abbreviation": "BZ"
                },
                {
                    "name": "Brescia",
                    "abbreviation": "BS"
                },
                {
                    "name": "Brindisi",
                    "abbreviation": "BR"
                },
                {
                    "name": "Cagliari",
                    "abbreviation": "CA"
                },
                {
                    "name": "Caltanissetta",
                    "abbreviation": "CL"
                },
                {
                    "name": "Campobasso",
                    "abbreviation": "CB"
                },
                {
                    "name": "Caserta",
                    "abbreviation": "CE"
                },
                {
                    "name": "Catania",
                    "abbreviation": "CT"
                },
                {
                    "name": "Catanzaro",
                    "abbreviation": "CZ"
                },
                {
                    "name": "Chieti",
                    "abbreviation": "CH"
                },
                {
                    "name": "Como",
                    "abbreviation": "CO"
                },
                {
                    "name": "Cosenza",
                    "abbreviation": "CS"
                },
                {
                    "name": "Cremona",
                    "abbreviation": "CR"
                },
                {
                    "name": "Crotone",
                    "abbreviation": "KR"
                },
                {
                    "name": "Cuneo",
                    "abbreviation": "CN"
                },
                {
                    "name": "Enna",
                    "abbreviation": "EN"
                },
                {
                    "name": "Ferrara",
                    "abbreviation": "FE"
                },
                {
                    "name": "Firenze",
                    "abbreviation": "FI"
                },
                {
                    "name": "Foggia",
                    "abbreviation": "FG"
                },
                {
                    "name": "Forlì-Cesena",
                    "abbreviation": "FC"
                },
                {
                    "name": "Frosinone",
                    "abbreviation": "FR"
                },
                {
                    "name": "Genova",
                    "abbreviation": "GE"
                },
                {
                    "name": "Gorizia",
                    "abbreviation": "GO"
                },
                {
                    "name": "Grosseto",
                    "abbreviation": "GR"
                },
                {
                    "name": "Imperia",
                    "abbreviation": "IM"
                },
                {
                    "name": "Isernia",
                    "abbreviation": "IS"
                },
                {
                    "name": "L'Aquila",
                    "abbreviation": "AQ"
                },
                {
                    "name": "La Spezia",
                    "abbreviation": "SP"
                },
                {
                    "name": "Latina",
                    "abbreviation": "LT"
                },
                {
                    "name": "Lecce",
                    "abbreviation": "LE"
                },
                {
                    "name": "Lecco",
                    "abbreviation": "LC"
                },
                {
                    "name": "Livorno",
                    "abbreviation": "LI"
                },
                {
                    "name": "Lodi",
                    "abbreviation": "LO"
                },
                {
                    "name": "Lucca",
                    "abbreviation": "LU"
                },
                {
                    "name": "Macerata",
                    "abbreviation": "MC"
                },
                {
                    "name": "Mantova",
                    "abbreviation": "MN"
                },
                {
                    "name": "Massa-Carrara",
                    "abbreviation": "MS"
                },
                {
                    "name": "Matera",
                    "abbreviation": "MT"
                },
                {
                    "name": "Messina",
                    "abbreviation": "ME"
                },
                {
                    "name": "Milano",
                    "abbreviation": "MI"
                },
                {
                    "name": "Modena",
                    "abbreviation": "MO"
                },
                {
                    "name": "Napoli",
                    "abbreviation": "NA"
                },
                {
                    "name": "Novara",
                    "abbreviation": "NO"
                },
                {
                    "name": "Nuoro",
                    "abbreviation": "NU"
                },
                {
                    "name": "Oristano",
                    "abbreviation": "OR"
                },
                {
                    "name": "Padova",
                    "abbreviation": "PD"
                },
                {
                    "name": "Palermo",
                    "abbreviation": "PA"
                },
                {
                    "name": "Parma",
                    "abbreviation": "PR"
                },
                {
                    "name": "Pavia",
                    "abbreviation": "PV"
                },
                {
                    "name": "Perugia",
                    "abbreviation": "PG"
                },
                {
                    "name": "Pesaro e Urbino",
                    "abbreviation": "PU"
                },
                {
                    "name": "Pescara",
                    "abbreviation": "PE"
                },
                {
                    "name": "Piacenza",
                    "abbreviation": "PC"
                },
                {
                    "name": "Pisa",
                    "abbreviation": "PI"
                },
                {
                    "name": "Pistoia",
                    "abbreviation": "PT"
                },
                {
                    "name": "Pordenone",
                    "abbreviation": "PN"
                },
                {
                    "name": "Potenza",
                    "abbreviation": "PZ"
                },
                {
                    "name": "Prato",
                    "abbreviation": "PO"
                },
                {
                    "name": "Ragusa",
                    "abbreviation": "RG"
                },
                {
                    "name": "Ravenna",
                    "abbreviation": "RA"
                },
                {
                    "name": "Reggio Calabria",
                    "abbreviation": "RC"
                },
                {
                    "name": "Reggio Emilia",
                    "abbreviation": "RE"
                },
                {
                    "name": "Rieti",
                    "abbreviation": "RI"
                },
                {
                    "name": "Rimini",
                    "abbreviation": "RN"
                },
                {
                    "name": "Roma",
                    "abbreviation": "RM"
                },
                {
                    "name": "Rovigo",
                    "abbreviation": "RO"
                },
                {
                    "name": "Salerno",
                    "abbreviation": "SA"
                },
                {
                    "name": "Sassari",
                    "abbreviation": "SS"
                },
                {
                    "name": "Savona",
                    "abbreviation": "SV"
                },
                {
                    "name": "Siena",
                    "abbreviation": "SI"
                },
                {
                    "name": "Siracusa",
                    "abbreviation": "SR"
                },
                {
                    "name": "Sondrio",
                    "abbreviation": "SO"
                },
                {
                    "name": "Taranto",
                    "abbreviation": "TA"
                },
                {
                    "name": "Teramo",
                    "abbreviation": "TE"
                },
                {
                    "name": "Terni",
                    "abbreviation": "TR"
                },
                {
                    "name": "Torino",
                    "abbreviation": "TO"
                },
                {
                    "name": "Trapani",
                    "abbreviation": "TP"
                },
                {
                    "name": "Trento",
                    "abbreviation": "TN"
                },
                {
                    "name": "Treviso",
                    "abbreviation": "TV"
                },
                {
                    "name": "Trieste",
                    "abbreviation": "TS"
                },
                {
                    "name": "Udine",
                    "abbreviation": "UD"
                },
                {
                    "name": "Varese",
                    "abbreviation": "VA"
                },
                {
                    "name": "Venezia",
                    "abbreviation": "VE"
                },
                {
                    "name": "Verbano-Cusio-Ossola",
                    "abbreviation": "VB"
                },
                {
                    "name": "Vercelli",
                    "abbreviation": "VC"
                },
                {
                    "name": "Verona",
                    "abbreviation": "VR"
                },
                {
                    "name": "Vibo Valentia",
                    "abbreviation": "VV"
                },
                {
                    "name": "Vicenza",
                    "abbreviation": "VI"
                },
                {
                    "name": "Viterbo",
                    "abbreviation": "VT"
                },
                {
                    "name": "Carbonia-Iglesias",
                    "abbreviation": "CI"
                },
                {
                    "name": "Olbia-Tempio",
                    "abbreviation": "OT"
                },
                {
                    "name": "Medio Campidano",
                    "abbreviation": "VS"
                },
                {
                    "name": "Ogliastra",
                    "abbreviation": "OG"
                },
                {
                    "name": "Barletta-Andria-Trani",
                    "abbreviation": "Bar"
                },
                {
                    "name": "Fermo",
                    "abbreviation": "Fer"
                },
                {
                    "name": "Monza e Brianza",
                    "abbreviation": "Mon"
                }
            ],
            "1108": [
                {
                    "name": "Clarendon",
                    "abbreviation": "CN"
                },
                {
                    "name": "Hanover",
                    "abbreviation": "HR"
                },
                {
                    "name": "Kingston",
                    "abbreviation": "KN"
                },
                {
                    "name": "Portland",
                    "abbreviation": "PD"
                },
                {
                    "name": "Saint Andrew",
                    "abbreviation": "AW"
                },
                {
                    "name": "Saint Ann",
                    "abbreviation": "AN"
                },
                {
                    "name": "Saint Catherine",
                    "abbreviation": "CE"
                },
                {
                    "name": "Saint Elizabeth",
                    "abbreviation": "EH"
                },
                {
                    "name": "Saint James",
                    "abbreviation": "JS"
                },
                {
                    "name": "Saint Mary",
                    "abbreviation": "MY"
                },
                {
                    "name": "Saint Thomas",
                    "abbreviation": "TS"
                },
                {
                    "name": "Trelawny",
                    "abbreviation": "TY"
                },
                {
                    "name": "Westmoreland",
                    "abbreviation": "WD"
                },
                {
                    "name": "Manchester",
                    "abbreviation": "MR"
                }
            ],
            "1109": [
                {
                    "name": "Aichi",
                    "abbreviation": "23"
                },
                {
                    "name": "Akita",
                    "abbreviation": "05"
                },
                {
                    "name": "Aomori",
                    "abbreviation": "02"
                },
                {
                    "name": "Chiba",
                    "abbreviation": "12"
                },
                {
                    "name": "Ehime",
                    "abbreviation": "38"
                },
                {
                    "name": "Fukui",
                    "abbreviation": "18"
                },
                {
                    "name": "Fukuoka",
                    "abbreviation": "40"
                },
                {
                    "name": "Fukusima",
                    "abbreviation": "07"
                },
                {
                    "name": "Gifu",
                    "abbreviation": "21"
                },
                {
                    "name": "Gunma",
                    "abbreviation": "10"
                },
                {
                    "name": "Hiroshima",
                    "abbreviation": "34"
                },
                {
                    "name": "Hokkaido",
                    "abbreviation": "01"
                },
                {
                    "name": "Hyogo",
                    "abbreviation": "28"
                },
                {
                    "name": "Ibaraki",
                    "abbreviation": "08"
                },
                {
                    "name": "Ishikawa",
                    "abbreviation": "17"
                },
                {
                    "name": "Iwate",
                    "abbreviation": "03"
                },
                {
                    "name": "Kagawa",
                    "abbreviation": "37"
                },
                {
                    "name": "Kagoshima",
                    "abbreviation": "46"
                },
                {
                    "name": "Kanagawa",
                    "abbreviation": "14"
                },
                {
                    "name": "Kochi",
                    "abbreviation": "39"
                },
                {
                    "name": "Kumamoto",
                    "abbreviation": "43"
                },
                {
                    "name": "Kyoto",
                    "abbreviation": "26"
                },
                {
                    "name": "Mie",
                    "abbreviation": "24"
                },
                {
                    "name": "Miyagi",
                    "abbreviation": "04"
                },
                {
                    "name": "Miyazaki",
                    "abbreviation": "45"
                },
                {
                    "name": "Nagano",
                    "abbreviation": "20"
                },
                {
                    "name": "Nagasaki",
                    "abbreviation": "42"
                },
                {
                    "name": "Nara",
                    "abbreviation": "29"
                },
                {
                    "name": "Niigata",
                    "abbreviation": "15"
                },
                {
                    "name": "Oita",
                    "abbreviation": "44"
                },
                {
                    "name": "Okayama",
                    "abbreviation": "33"
                },
                {
                    "name": "Okinawa",
                    "abbreviation": "47"
                },
                {
                    "name": "Osaka",
                    "abbreviation": "27"
                },
                {
                    "name": "Saga",
                    "abbreviation": "41"
                },
                {
                    "name": "Saitama",
                    "abbreviation": "11"
                },
                {
                    "name": "Shiga",
                    "abbreviation": "25"
                },
                {
                    "name": "Shimane",
                    "abbreviation": "32"
                },
                {
                    "name": "Shizuoka",
                    "abbreviation": "22"
                },
                {
                    "name": "Tochigi",
                    "abbreviation": "09"
                },
                {
                    "name": "Tokushima",
                    "abbreviation": "36"
                },
                {
                    "name": "Tokyo",
                    "abbreviation": "13"
                },
                {
                    "name": "Tottori",
                    "abbreviation": "31"
                },
                {
                    "name": "Toyama",
                    "abbreviation": "16"
                },
                {
                    "name": "Wakayama",
                    "abbreviation": "30"
                },
                {
                    "name": "Yamagata",
                    "abbreviation": "06"
                },
                {
                    "name": "Yamaguchi",
                    "abbreviation": "35"
                },
                {
                    "name": "Yamanashi",
                    "abbreviation": "19"
                }
            ],
            "1110": [
                {
                    "name": "Ajln",
                    "abbreviation": "AJ"
                },
                {
                    "name": "Al 'Aqaba",
                    "abbreviation": "AQ"
                },
                {
                    "name": "Al Balqa'",
                    "abbreviation": "BA"
                },
                {
                    "name": "Al Karak",
                    "abbreviation": "KA"
                },
                {
                    "name": "Al Mafraq",
                    "abbreviation": "MA"
                },
                {
                    "name": "Amman",
                    "abbreviation": "AM"
                },
                {
                    "name": "At Tafilah",
                    "abbreviation": "AT"
                },
                {
                    "name": "Az Zarga",
                    "abbreviation": "AZ"
                },
                {
                    "name": "Irbid",
                    "abbreviation": "JR"
                },
                {
                    "name": "Jarash",
                    "abbreviation": "JA"
                },
                {
                    "name": "Ma'an",
                    "abbreviation": "MN"
                },
                {
                    "name": "Madaba",
                    "abbreviation": "MD"
                }
            ],
            "1111": [
                {
                    "name": "Almaty",
                    "abbreviation": "ALA"
                },
                {
                    "name": "Astana",
                    "abbreviation": "AST"
                },
                {
                    "name": "Almaty oblysy",
                    "abbreviation": "ALM"
                },
                {
                    "name": "Aqmola oblysy",
                    "abbreviation": "AKM"
                },
                {
                    "name": "Aqtobe oblysy",
                    "abbreviation": "AKT"
                },
                {
                    "name": "Atyrau oblyfiy",
                    "abbreviation": "ATY"
                },
                {
                    "name": "Batys Quzaqstan oblysy",
                    "abbreviation": "ZAP"
                },
                {
                    "name": "Mangghystau oblysy",
                    "abbreviation": "MAN"
                },
                {
                    "name": "Ongtustik Quzaqstan oblysy",
                    "abbreviation": "YUZ"
                },
                {
                    "name": "Pavlodar oblysy",
                    "abbreviation": "PAV"
                },
                {
                    "name": "Qaraghandy oblysy",
                    "abbreviation": "KAR"
                },
                {
                    "name": "Qostanay oblysy",
                    "abbreviation": "KUS"
                },
                {
                    "name": "Qyzylorda oblysy",
                    "abbreviation": "KZY"
                },
                {
                    "name": "Shyghys Quzaqstan oblysy",
                    "abbreviation": "VOS"
                },
                {
                    "name": "Soltustik Quzaqstan oblysy",
                    "abbreviation": "SEV"
                },
                {
                    "name": "Zhambyl oblysy Zhambylskaya oblast'",
                    "abbreviation": "ZHA"
                }
            ],
            "1112": [
                {
                    "name": "Nairobi Municipality",
                    "abbreviation": "110"
                },
                {
                    "name": "Coast",
                    "abbreviation": "300"
                },
                {
                    "name": "North-Eastern Kaskazini Mashariki",
                    "abbreviation": "500"
                },
                {
                    "name": "Rift Valley",
                    "abbreviation": "700"
                },
                {
                    "name": "Western Magharibi",
                    "abbreviation": "900"
                }
            ],
            "1113": [
                {
                    "name": "Gilbert Islands",
                    "abbreviation": "G"
                },
                {
                    "name": "Line Islands",
                    "abbreviation": "L"
                },
                {
                    "name": "Phoenix Islands",
                    "abbreviation": "P"
                }
            ],
            "1114": [
                {
                    "name": "Kaesong-si",
                    "abbreviation": "KAE"
                },
                {
                    "name": "Nampo-si",
                    "abbreviation": "NAM"
                },
                {
                    "name": "Pyongyang-ai",
                    "abbreviation": "PYO"
                },
                {
                    "name": "Chagang-do",
                    "abbreviation": "CHA"
                },
                {
                    "name": "Hamgyongbuk-do",
                    "abbreviation": "HAB"
                },
                {
                    "name": "Hamgyongnam-do",
                    "abbreviation": "HAN"
                },
                {
                    "name": "Hwanghaebuk-do",
                    "abbreviation": "HWB"
                },
                {
                    "name": "Hwanghaenam-do",
                    "abbreviation": "HWN"
                },
                {
                    "name": "Kangwon-do",
                    "abbreviation": "KAN"
                },
                {
                    "name": "Pyonganbuk-do",
                    "abbreviation": "PYB"
                },
                {
                    "name": "Pyongannam-do",
                    "abbreviation": "PYN"
                },
                {
                    "name": "Yanggang-do",
                    "abbreviation": "YAN"
                },
                {
                    "name": "Najin Sonbong-si",
                    "abbreviation": "NAJ"
                }
            ],
            "1115": [
                {
                    "name": "Seoul Teugbyeolsi",
                    "abbreviation": "11"
                },
                {
                    "name": "Busan Gwang'yeogsi",
                    "abbreviation": "26"
                },
                {
                    "name": "Daegu Gwang'yeogsi",
                    "abbreviation": "27"
                },
                {
                    "name": "Daejeon Gwang'yeogsi",
                    "abbreviation": "30"
                },
                {
                    "name": "Gwangju Gwang'yeogsi",
                    "abbreviation": "29"
                },
                {
                    "name": "Incheon Gwang'yeogsi",
                    "abbreviation": "28"
                },
                {
                    "name": "Ulsan Gwang'yeogsi",
                    "abbreviation": "31"
                },
                {
                    "name": "Chungcheongbugdo",
                    "abbreviation": "43"
                },
                {
                    "name": "Chungcheongnamdo",
                    "abbreviation": "44"
                },
                {
                    "name": "Gang'weondo",
                    "abbreviation": "42"
                },
                {
                    "name": "Gyeonggido",
                    "abbreviation": "41"
                },
                {
                    "name": "Gyeongsangbugdo",
                    "abbreviation": "47"
                },
                {
                    "name": "Gyeongsangnamdo",
                    "abbreviation": "48"
                },
                {
                    "name": "Jejudo",
                    "abbreviation": "49"
                },
                {
                    "name": "Jeonrabugdo",
                    "abbreviation": "45"
                },
                {
                    "name": "Jeonranamdo",
                    "abbreviation": "46"
                }
            ],
            "1116": [
                {
                    "name": "Al Ahmadi",
                    "abbreviation": "AH"
                },
                {
                    "name": "Al Farwanlyah",
                    "abbreviation": "FA"
                },
                {
                    "name": "Al Jahrah",
                    "abbreviation": "JA"
                },
                {
                    "name": "Al Kuwayt",
                    "abbreviation": "KU"
                },
                {
                    "name": "Hawalli",
                    "abbreviation": "HA"
                }
            ],
            "1117": [
                {
                    "name": "Bishkek",
                    "abbreviation": "GB"
                },
                {
                    "name": "Batken",
                    "abbreviation": "B"
                },
                {
                    "name": "Chu",
                    "abbreviation": "C"
                },
                {
                    "name": "Jalal-Abad",
                    "abbreviation": "J"
                },
                {
                    "name": "Naryn",
                    "abbreviation": "N"
                },
                {
                    "name": "Osh",
                    "abbreviation": "O"
                },
                {
                    "name": "Talas",
                    "abbreviation": "T"
                },
                {
                    "name": "Ysyk-Kol",
                    "abbreviation": "Y"
                }
            ],
            "1118": [
                {
                    "name": "Vientiane",
                    "abbreviation": "VT"
                },
                {
                    "name": "Attapu",
                    "abbreviation": "AT"
                },
                {
                    "name": "Bokeo",
                    "abbreviation": "BK"
                },
                {
                    "name": "Bolikhamxai",
                    "abbreviation": "BL"
                },
                {
                    "name": "Champasak",
                    "abbreviation": "CH"
                },
                {
                    "name": "Houaphan",
                    "abbreviation": "HO"
                },
                {
                    "name": "Khammouan",
                    "abbreviation": "KH"
                },
                {
                    "name": "Louang Namtha",
                    "abbreviation": "LM"
                },
                {
                    "name": "Louangphabang",
                    "abbreviation": "LP"
                },
                {
                    "name": "Oudomxai",
                    "abbreviation": "OU"
                },
                {
                    "name": "Phongsali",
                    "abbreviation": "PH"
                },
                {
                    "name": "Salavan",
                    "abbreviation": "SL"
                },
                {
                    "name": "Savannakhet",
                    "abbreviation": "SV"
                },
                {
                    "name": "Xaignabouli",
                    "abbreviation": "XA"
                },
                {
                    "name": "Xiasomboun",
                    "abbreviation": "XN"
                },
                {
                    "name": "Xekong",
                    "abbreviation": "XE"
                },
                {
                    "name": "Xiangkhoang",
                    "abbreviation": "XI"
                }
            ],
            "1119": [
                {
                    "name": "Aizkraukles Apripkis",
                    "abbreviation": "AI"
                },
                {
                    "name": "Alkanes Apripkis",
                    "abbreviation": "AL"
                },
                {
                    "name": "Balvu Apripkis",
                    "abbreviation": "BL"
                },
                {
                    "name": "Bauskas Apripkis",
                    "abbreviation": "BU"
                },
                {
                    "name": "Cesu Aprikis",
                    "abbreviation": "CE"
                },
                {
                    "name": "Daugavpile Apripkis",
                    "abbreviation": "DA"
                },
                {
                    "name": "Dobeles Apripkis",
                    "abbreviation": "DO"
                },
                {
                    "name": "Gulbenes Aprlpkis",
                    "abbreviation": "GU"
                },
                {
                    "name": "Jelgavas Apripkis",
                    "abbreviation": "JL"
                },
                {
                    "name": "Jekabpils Apripkis",
                    "abbreviation": "JK"
                },
                {
                    "name": "Kraslavas Apripkis",
                    "abbreviation": "KR"
                },
                {
                    "name": "Kuldlgas Apripkis",
                    "abbreviation": "KU"
                },
                {
                    "name": "Limbazu Apripkis",
                    "abbreviation": "LM"
                },
                {
                    "name": "Liepajas Apripkis",
                    "abbreviation": "LE"
                },
                {
                    "name": "Ludzas Apripkis",
                    "abbreviation": "LU"
                },
                {
                    "name": "Madonas Apripkis",
                    "abbreviation": "MA"
                },
                {
                    "name": "Ogres Apripkis",
                    "abbreviation": "OG"
                },
                {
                    "name": "Preilu Apripkis",
                    "abbreviation": "PR"
                },
                {
                    "name": "Rezaknes Apripkis",
                    "abbreviation": "RE"
                },
                {
                    "name": "Rigas Apripkis",
                    "abbreviation": "RI"
                },
                {
                    "name": "Saldus Apripkis",
                    "abbreviation": "SA"
                },
                {
                    "name": "Talsu Apripkis",
                    "abbreviation": "TA"
                },
                {
                    "name": "Tukuma Apriplcis",
                    "abbreviation": "TU"
                },
                {
                    "name": "Valkas Apripkis",
                    "abbreviation": "VK"
                },
                {
                    "name": "Valmieras Apripkis",
                    "abbreviation": "VM"
                },
                {
                    "name": "Ventspils Apripkis",
                    "abbreviation": "VE"
                },
                {
                    "name": "Daugavpils",
                    "abbreviation": "DGV"
                },
                {
                    "name": "Jelgava",
                    "abbreviation": "JEL"
                },
                {
                    "name": "Jurmala",
                    "abbreviation": "JUR"
                },
                {
                    "name": "Liepaja",
                    "abbreviation": "LPX"
                },
                {
                    "name": "Rezekne",
                    "abbreviation": "REZ"
                },
                {
                    "name": "Riga",
                    "abbreviation": "RIX"
                },
                {
                    "name": "Ventspils",
                    "abbreviation": "VEN"
                }
            ],
            "1120": [
                {
                    "name": "Beirout",
                    "abbreviation": "BA"
                },
                {
                    "name": "El Begsa",
                    "abbreviation": "BI"
                },
                {
                    "name": "Jabal Loubnane",
                    "abbreviation": "JL"
                },
                {
                    "name": "Loubnane ech Chemali",
                    "abbreviation": "AS"
                },
                {
                    "name": "Loubnane ej Jnoubi",
                    "abbreviation": "JA"
                },
                {
                    "name": "Nabatiye",
                    "abbreviation": "NA"
                }
            ],
            "1121": [
                {
                    "name": "Berea",
                    "abbreviation": "D"
                },
                {
                    "name": "Butha-Buthe",
                    "abbreviation": "B"
                },
                {
                    "name": "Leribe",
                    "abbreviation": "C"
                },
                {
                    "name": "Mafeteng",
                    "abbreviation": "E"
                },
                {
                    "name": "Maseru",
                    "abbreviation": "A"
                },
                {
                    "name": "Mohale's Hoek",
                    "abbreviation": "F"
                },
                {
                    "name": "Mokhotlong",
                    "abbreviation": "J"
                },
                {
                    "name": "Qacha's Nek",
                    "abbreviation": "H"
                },
                {
                    "name": "Quthing",
                    "abbreviation": "G"
                },
                {
                    "name": "Thaba-Tseka",
                    "abbreviation": "K"
                }
            ],
            "1122": [
                {
                    "name": "Bomi",
                    "abbreviation": "BM"
                },
                {
                    "name": "Bong",
                    "abbreviation": "BG"
                },
                {
                    "name": "Grand Basaa",
                    "abbreviation": "GB"
                },
                {
                    "name": "Grand Cape Mount",
                    "abbreviation": "CM"
                },
                {
                    "name": "Grand Gedeh",
                    "abbreviation": "GG"
                },
                {
                    "name": "Grand Kru",
                    "abbreviation": "GK"
                },
                {
                    "name": "Lofa",
                    "abbreviation": "LO"
                },
                {
                    "name": "Margibi",
                    "abbreviation": "MG"
                },
                {
                    "name": "Maryland",
                    "abbreviation": "MY"
                },
                {
                    "name": "Montserrado",
                    "abbreviation": "MO"
                },
                {
                    "name": "Nimba",
                    "abbreviation": "NI"
                },
                {
                    "name": "Rivercess",
                    "abbreviation": "RI"
                },
                {
                    "name": "Sinoe",
                    "abbreviation": "SI"
                }
            ],
            "1123": [
                {
                    "name": "Ajdābiyā",
                    "abbreviation": "AJ"
                },
                {
                    "name": "Al Buţnān",
                    "abbreviation": "BU"
                },
                {
                    "name": "Al Hizām al Akhdar",
                    "abbreviation": "HZ"
                },
                {
                    "name": "Al Jabal al Akhdar",
                    "abbreviation": "JA"
                },
                {
                    "name": "Al Jifārah",
                    "abbreviation": "JI"
                },
                {
                    "name": "Al Jufrah",
                    "abbreviation": "JU"
                },
                {
                    "name": "Al Kufrah",
                    "abbreviation": "KF"
                },
                {
                    "name": "Al Marj",
                    "abbreviation": "MJ"
                },
                {
                    "name": "Al Marqab",
                    "abbreviation": "MB"
                },
                {
                    "name": "Al Qaţrūn",
                    "abbreviation": "QT"
                },
                {
                    "name": "Al Qubbah",
                    "abbreviation": "QB"
                },
                {
                    "name": "Al Wāhah",
                    "abbreviation": "WA"
                },
                {
                    "name": "An Nuqaţ al Khams",
                    "abbreviation": "NQ"
                },
                {
                    "name": "Ash Shāţi'",
                    "abbreviation": "SH"
                },
                {
                    "name": "Az Zāwiyah",
                    "abbreviation": "ZA"
                },
                {
                    "name": "Banghāzī",
                    "abbreviation": "BA"
                },
                {
                    "name": "Banī Walīd",
                    "abbreviation": "BW"
                },
                {
                    "name": "Darnah",
                    "abbreviation": "DR"
                },
                {
                    "name": "Ghadāmis",
                    "abbreviation": "GD"
                },
                {
                    "name": "Gharyān",
                    "abbreviation": "GR"
                },
                {
                    "name": "Ghāt",
                    "abbreviation": "GT"
                },
                {
                    "name": "Jaghbūb",
                    "abbreviation": "JB"
                },
                {
                    "name": "Mişrātah",
                    "abbreviation": "MI"
                },
                {
                    "name": "Mizdah",
                    "abbreviation": "MZ"
                },
                {
                    "name": "Murzuq",
                    "abbreviation": "MQ"
                },
                {
                    "name": "Nālūt",
                    "abbreviation": "NL"
                },
                {
                    "name": "Sabhā",
                    "abbreviation": "SB"
                },
                {
                    "name": "Şabrātah Şurmān",
                    "abbreviation": "SS"
                },
                {
                    "name": "Surt",
                    "abbreviation": "SR"
                },
                {
                    "name": "Tājūrā' wa an Nawāhī al Arbāh",
                    "abbreviation": "TN"
                },
                {
                    "name": "Ţarābulus",
                    "abbreviation": "TB"
                },
                {
                    "name": "Tarhūnah-Masallātah",
                    "abbreviation": "TM"
                },
                {
                    "name": "Wādī al hayāt",
                    "abbreviation": "WD"
                },
                {
                    "name": "Yafran-Jādū",
                    "abbreviation": "YJ"
                }
            ],
            "1125": [
                {
                    "name": "Alytaus Apskritis",
                    "abbreviation": "AL"
                },
                {
                    "name": "Kauno Apskritis",
                    "abbreviation": "KU"
                },
                {
                    "name": "Klaipedos Apskritis",
                    "abbreviation": "KL"
                },
                {
                    "name": "Marijampoles Apskritis",
                    "abbreviation": "MR"
                },
                {
                    "name": "Panevezio Apskritis",
                    "abbreviation": "PN"
                },
                {
                    "name": "Sisuliu Apskritis",
                    "abbreviation": "SA"
                },
                {
                    "name": "Taurages Apskritis",
                    "abbreviation": "TA"
                },
                {
                    "name": "Telsiu Apskritis",
                    "abbreviation": "TE"
                },
                {
                    "name": "Utenos Apskritis",
                    "abbreviation": "UT"
                },
                {
                    "name": "Vilniaus Apskritis",
                    "abbreviation": "VL"
                }
            ],
            "1126": [
                {
                    "name": "Diekirch",
                    "abbreviation": "D"
                },
                {
                    "name": "GreveNmacher",
                    "abbreviation": "G"
                }
            ],
            "1129": [
                {
                    "name": "Antananarivo",
                    "abbreviation": "T"
                },
                {
                    "name": "Antsiranana",
                    "abbreviation": "D"
                },
                {
                    "name": "Fianarantsoa",
                    "abbreviation": "F"
                },
                {
                    "name": "Mahajanga",
                    "abbreviation": "M"
                },
                {
                    "name": "Toamasina",
                    "abbreviation": "A"
                },
                {
                    "name": "Toliara",
                    "abbreviation": "U"
                }
            ],
            "1130": [
                {
                    "name": "Balaka",
                    "abbreviation": "BA"
                },
                {
                    "name": "Blantyre",
                    "abbreviation": "BL"
                },
                {
                    "name": "Chikwawa",
                    "abbreviation": "CK"
                },
                {
                    "name": "Chiradzulu",
                    "abbreviation": "CR"
                },
                {
                    "name": "Chitipa",
                    "abbreviation": "CT"
                },
                {
                    "name": "Dedza",
                    "abbreviation": "DE"
                },
                {
                    "name": "Dowa",
                    "abbreviation": "DO"
                },
                {
                    "name": "Karonga",
                    "abbreviation": "KR"
                },
                {
                    "name": "Kasungu",
                    "abbreviation": "KS"
                },
                {
                    "name": "Likoma Island",
                    "abbreviation": "LK"
                },
                {
                    "name": "Lilongwe",
                    "abbreviation": "LI"
                },
                {
                    "name": "Machinga",
                    "abbreviation": "MH"
                },
                {
                    "name": "Mangochi",
                    "abbreviation": "MG"
                },
                {
                    "name": "Mchinji",
                    "abbreviation": "MC"
                },
                {
                    "name": "Mulanje",
                    "abbreviation": "MU"
                },
                {
                    "name": "Mwanza",
                    "abbreviation": "MW"
                },
                {
                    "name": "Mzimba",
                    "abbreviation": "MZ"
                },
                {
                    "name": "Nkhata Bay",
                    "abbreviation": "NB"
                },
                {
                    "name": "Nkhotakota",
                    "abbreviation": "NK"
                },
                {
                    "name": "Nsanje",
                    "abbreviation": "NS"
                },
                {
                    "name": "Ntcheu",
                    "abbreviation": "NU"
                },
                {
                    "name": "Ntchisi",
                    "abbreviation": "NI"
                },
                {
                    "name": "Phalomba",
                    "abbreviation": "PH"
                },
                {
                    "name": "Rumphi",
                    "abbreviation": "RU"
                },
                {
                    "name": "Salima",
                    "abbreviation": "SA"
                },
                {
                    "name": "Thyolo",
                    "abbreviation": "TH"
                },
                {
                    "name": "Zomba",
                    "abbreviation": "ZO"
                }
            ],
            "1131": [
                {
                    "name": "Wilayah Persekutuan Kuala Lumpur",
                    "abbreviation": "14"
                },
                {
                    "name": "Wilayah Persekutuan Labuan",
                    "abbreviation": "15"
                },
                {
                    "name": "Wilayah Persekutuan Putrajaya",
                    "abbreviation": "16"
                },
                {
                    "name": "Johor",
                    "abbreviation": "01"
                },
                {
                    "name": "Kedah",
                    "abbreviation": "02"
                },
                {
                    "name": "Kelantan",
                    "abbreviation": "03"
                },
                {
                    "name": "Melaka",
                    "abbreviation": "04"
                },
                {
                    "name": "Negeri Sembilan",
                    "abbreviation": "05"
                },
                {
                    "name": "Pahang",
                    "abbreviation": "06"
                },
                {
                    "name": "Perak",
                    "abbreviation": "08"
                },
                {
                    "name": "Perlis",
                    "abbreviation": "09"
                },
                {
                    "name": "Pulau Pinang",
                    "abbreviation": "07"
                },
                {
                    "name": "Sabah",
                    "abbreviation": "12"
                },
                {
                    "name": "Sarawak",
                    "abbreviation": "13"
                },
                {
                    "name": "Selangor",
                    "abbreviation": "10"
                },
                {
                    "name": "Terengganu",
                    "abbreviation": "11"
                }
            ],
            "1132": [
                {
                    "name": "Male",
                    "abbreviation": "MLE"
                },
                {
                    "name": "Alif",
                    "abbreviation": "02"
                },
                {
                    "name": "Baa",
                    "abbreviation": "20"
                },
                {
                    "name": "Dhaalu",
                    "abbreviation": "17"
                },
                {
                    "name": "Faafu",
                    "abbreviation": "14"
                },
                {
                    "name": "Gaaf Alif",
                    "abbreviation": "27"
                },
                {
                    "name": "Gaefu Dhaalu",
                    "abbreviation": "28"
                },
                {
                    "name": "Gnaviyani",
                    "abbreviation": "29"
                },
                {
                    "name": "Haa Alif",
                    "abbreviation": "07"
                },
                {
                    "name": "Haa Dhaalu",
                    "abbreviation": "23"
                },
                {
                    "name": "Kaafu",
                    "abbreviation": "26"
                },
                {
                    "name": "Laamu",
                    "abbreviation": "05"
                },
                {
                    "name": "Lhaviyani",
                    "abbreviation": "03"
                },
                {
                    "name": "Meemu",
                    "abbreviation": "12"
                },
                {
                    "name": "Noonu",
                    "abbreviation": "25"
                },
                {
                    "name": "Raa",
                    "abbreviation": "13"
                },
                {
                    "name": "Seenu",
                    "abbreviation": "01"
                },
                {
                    "name": "Shaviyani",
                    "abbreviation": "24"
                },
                {
                    "name": "Thaa",
                    "abbreviation": "08"
                },
                {
                    "name": "Vaavu",
                    "abbreviation": "04"
                }
            ],
            "1133": [
                {
                    "name": "Bamako",
                    "abbreviation": "BK0"
                },
                {
                    "name": "Gao",
                    "abbreviation": "7"
                },
                {
                    "name": "Kayes",
                    "abbreviation": "1"
                },
                {
                    "name": "Kidal",
                    "abbreviation": "8"
                },
                {
                    "name": "Xoulikoro",
                    "abbreviation": "2"
                },
                {
                    "name": "Mopti",
                    "abbreviation": "5"
                },
                {
                    "name": "S69ou",
                    "abbreviation": "4"
                },
                {
                    "name": "Sikasso",
                    "abbreviation": "3"
                },
                {
                    "name": "Tombouctou",
                    "abbreviation": "6"
                }
            ],
            "1135": [
                {
                    "name": "Ailinglapalap",
                    "abbreviation": "ALL"
                },
                {
                    "name": "Ailuk",
                    "abbreviation": "ALK"
                },
                {
                    "name": "Arno",
                    "abbreviation": "ARN"
                },
                {
                    "name": "Aur",
                    "abbreviation": "AUR"
                },
                {
                    "name": "Ebon",
                    "abbreviation": "EBO"
                },
                {
                    "name": "Eniwetok",
                    "abbreviation": "ENI"
                },
                {
                    "name": "Jaluit",
                    "abbreviation": "JAL"
                },
                {
                    "name": "Kili",
                    "abbreviation": "KIL"
                },
                {
                    "name": "Kwajalein",
                    "abbreviation": "KWA"
                },
                {
                    "name": "Lae",
                    "abbreviation": "LAE"
                },
                {
                    "name": "Lib",
                    "abbreviation": "LIB"
                },
                {
                    "name": "Likiep",
                    "abbreviation": "LIK"
                },
                {
                    "name": "Majuro",
                    "abbreviation": "MAJ"
                },
                {
                    "name": "Maloelap",
                    "abbreviation": "MAL"
                },
                {
                    "name": "Mejit",
                    "abbreviation": "MEJ"
                },
                {
                    "name": "Mili",
                    "abbreviation": "MIL"
                },
                {
                    "name": "Namorik",
                    "abbreviation": "NMK"
                },
                {
                    "name": "Namu",
                    "abbreviation": "NMU"
                },
                {
                    "name": "Rongelap",
                    "abbreviation": "RON"
                },
                {
                    "name": "Ujae",
                    "abbreviation": "UJA"
                },
                {
                    "name": "Ujelang",
                    "abbreviation": "UJL"
                },
                {
                    "name": "Utirik",
                    "abbreviation": "UTI"
                },
                {
                    "name": "Wotho",
                    "abbreviation": "WTN"
                },
                {
                    "name": "Wotje",
                    "abbreviation": "WTJ"
                }
            ],
            "1137": [
                {
                    "name": "Nouakchott",
                    "abbreviation": "NKC"
                },
                {
                    "name": "Assaba",
                    "abbreviation": "03"
                },
                {
                    "name": "Brakna",
                    "abbreviation": "05"
                },
                {
                    "name": "Dakhlet Nouadhibou",
                    "abbreviation": "08"
                },
                {
                    "name": "Gorgol",
                    "abbreviation": "04"
                },
                {
                    "name": "Guidimaka",
                    "abbreviation": "10"
                },
                {
                    "name": "Hodh ech Chargui",
                    "abbreviation": "01"
                },
                {
                    "name": "Hodh el Charbi",
                    "abbreviation": "02"
                },
                {
                    "name": "Inchiri",
                    "abbreviation": "12"
                },
                {
                    "name": "Tagant",
                    "abbreviation": "09"
                },
                {
                    "name": "Tiris Zemmour",
                    "abbreviation": "11"
                },
                {
                    "name": "Trarza",
                    "abbreviation": "06"
                }
            ],
            "1138": [
                {
                    "name": "Beau Bassin-Rose Hill",
                    "abbreviation": "BR"
                },
                {
                    "name": "Curepipe",
                    "abbreviation": "CU"
                },
                {
                    "name": "Port Louis",
                    "abbreviation": "PU"
                },
                {
                    "name": "Quatre Bornes",
                    "abbreviation": "QB"
                },
                {
                    "name": "Vacosa-Phoenix",
                    "abbreviation": "VP"
                },
                {
                    "name": "Black River",
                    "abbreviation": "BL"
                },
                {
                    "name": "Flacq",
                    "abbreviation": "FL"
                },
                {
                    "name": "Grand Port",
                    "abbreviation": "GP"
                },
                {
                    "name": "Moka",
                    "abbreviation": "MO"
                },
                {
                    "name": "Pamplemousses",
                    "abbreviation": "PA"
                },
                {
                    "name": "Plaines Wilhems",
                    "abbreviation": "PW"
                },
                {
                    "name": "Riviere du Rempart",
                    "abbreviation": "RP"
                },
                {
                    "name": "Savanne",
                    "abbreviation": "SA"
                },
                {
                    "name": "Agalega Islands",
                    "abbreviation": "AG"
                },
                {
                    "name": "Cargados Carajos Shoals",
                    "abbreviation": "CC"
                },
                {
                    "name": "Rodrigues Island",
                    "abbreviation": "RO"
                }
            ],
            "1140": [
                {
                    "name": "Aguascalientes",
                    "abbreviation": "AGU"
                },
                {
                    "name": "Baja California",
                    "abbreviation": "BCN"
                },
                {
                    "name": "Baja California Sur",
                    "abbreviation": "BCS"
                },
                {
                    "name": "Campeche",
                    "abbreviation": "CAM"
                },
                {
                    "name": "Coahuila",
                    "abbreviation": "COA"
                },
                {
                    "name": "Colima",
                    "abbreviation": "COL"
                },
                {
                    "name": "Chiapas",
                    "abbreviation": "CHP"
                },
                {
                    "name": "Chihuahua",
                    "abbreviation": "CHH"
                },
                {
                    "name": "Durango",
                    "abbreviation": "DUR"
                },
                {
                    "name": "Guanajuato",
                    "abbreviation": "GUA"
                },
                {
                    "name": "Guerrero",
                    "abbreviation": "GRO"
                },
                {
                    "name": "Hidalgo",
                    "abbreviation": "HID"
                },
                {
                    "name": "Jalisco",
                    "abbreviation": "JAL"
                },
                {
                    "name": "Mexico",
                    "abbreviation": "MEX"
                },
                {
                    "name": "Michoacin",
                    "abbreviation": "MIC"
                },
                {
                    "name": "Morelos",
                    "abbreviation": "MOR"
                },
                {
                    "name": "Nayarit",
                    "abbreviation": "NAY"
                },
                {
                    "name": "Nuevo Leon",
                    "abbreviation": "NLE"
                },
                {
                    "name": "Oaxaca",
                    "abbreviation": "OAX"
                },
                {
                    "name": "Puebla",
                    "abbreviation": "PUE"
                },
                {
                    "name": "Queretaro",
                    "abbreviation": "QUE"
                },
                {
                    "name": "Quintana Roo",
                    "abbreviation": "ROO"
                },
                {
                    "name": "San Luis Potosi",
                    "abbreviation": "SLP"
                },
                {
                    "name": "Sinaloa",
                    "abbreviation": "SIN"
                },
                {
                    "name": "Sonora",
                    "abbreviation": "SON"
                },
                {
                    "name": "Tabasco",
                    "abbreviation": "TAB"
                },
                {
                    "name": "Tamaulipas",
                    "abbreviation": "TAM"
                },
                {
                    "name": "Tlaxcala",
                    "abbreviation": "TLA"
                },
                {
                    "name": "Veracruz",
                    "abbreviation": "VER"
                },
                {
                    "name": "Yucatan",
                    "abbreviation": "YUC"
                },
                {
                    "name": "Zacatecas",
                    "abbreviation": "ZAC"
                },
                {
                    "name": "Distrito Federal",
                    "abbreviation": "DIF"
                }
            ],
            "1141": [
                {
                    "name": "Chuuk",
                    "abbreviation": "TRK"
                },
                {
                    "name": "Kosrae",
                    "abbreviation": "KSA"
                },
                {
                    "name": "Pohnpei",
                    "abbreviation": "PNI"
                },
                {
                    "name": "Yap",
                    "abbreviation": "YAP"
                }
            ],
            "1142": [
                {
                    "name": "Gagauzia, Unitate Teritoriala Autonoma",
                    "abbreviation": "GA"
                },
                {
                    "name": "Chisinau",
                    "abbreviation": "CU"
                },
                {
                    "name": "Stinga Nistrului, unitatea teritoriala din",
                    "abbreviation": "SN"
                },
                {
                    "name": "Balti",
                    "abbreviation": "BA"
                },
                {
                    "name": "Cahul",
                    "abbreviation": "CA"
                },
                {
                    "name": "Edinet",
                    "abbreviation": "ED"
                },
                {
                    "name": "Lapusna",
                    "abbreviation": "LA"
                },
                {
                    "name": "Orhei",
                    "abbreviation": "OR"
                },
                {
                    "name": "Soroca",
                    "abbreviation": "SO"
                },
                {
                    "name": "Taraclia",
                    "abbreviation": "TA"
                },
                {
                    "name": "Tighina [Bender]",
                    "abbreviation": "TI"
                },
                {
                    "name": "Ungheni",
                    "abbreviation": "UN"
                }
            ],
            "1144": [
                {
                    "name": "Ulaanbaatar",
                    "abbreviation": "1"
                },
                {
                    "name": "Arhangay",
                    "abbreviation": "073"
                },
                {
                    "name": "Bayanhongor",
                    "abbreviation": "069"
                },
                {
                    "name": "Bayan-Olgiy",
                    "abbreviation": "071"
                },
                {
                    "name": "Bulgan",
                    "abbreviation": "067"
                },
                {
                    "name": "Darhan uul",
                    "abbreviation": "037"
                },
                {
                    "name": "Dornod",
                    "abbreviation": "061"
                },
                {
                    "name": "Dornogov,",
                    "abbreviation": "063"
                },
                {
                    "name": "DundgovL",
                    "abbreviation": "059"
                },
                {
                    "name": "Dzavhan",
                    "abbreviation": "057"
                },
                {
                    "name": "Govi-Altay",
                    "abbreviation": "065"
                },
                {
                    "name": "Govi-Smber",
                    "abbreviation": "064"
                },
                {
                    "name": "Hentiy",
                    "abbreviation": "039"
                },
                {
                    "name": "Hovd",
                    "abbreviation": "043"
                },
                {
                    "name": "Hovsgol",
                    "abbreviation": "041"
                },
                {
                    "name": "Omnogovi",
                    "abbreviation": "053"
                },
                {
                    "name": "Orhon",
                    "abbreviation": "035"
                },
                {
                    "name": "Ovorhangay",
                    "abbreviation": "055"
                },
                {
                    "name": "Selenge",
                    "abbreviation": "049"
                },
                {
                    "name": "Shbaatar",
                    "abbreviation": "051"
                },
                {
                    "name": "Tov",
                    "abbreviation": "047"
                },
                {
                    "name": "Uvs",
                    "abbreviation": "046"
                }
            ],
            "1146": [
                {
                    "name": "Agadir",
                    "abbreviation": "AGD"
                },
                {
                    "name": "Aït Baha",
                    "abbreviation": "BAH"
                },
                {
                    "name": "Aït Melloul",
                    "abbreviation": "MEL"
                },
                {
                    "name": "Al Haouz",
                    "abbreviation": "HAO"
                },
                {
                    "name": "Al Hoceïma",
                    "abbreviation": "HOC"
                },
                {
                    "name": "Assa-Zag",
                    "abbreviation": "ASZ"
                },
                {
                    "name": "Azilal",
                    "abbreviation": "AZI"
                },
                {
                    "name": "Beni Mellal",
                    "abbreviation": "BEM"
                },
                {
                    "name": "Ben Sllmane",
                    "abbreviation": "BES"
                },
                {
                    "name": "Berkane",
                    "abbreviation": "BER"
                },
                {
                    "name": "Boujdour",
                    "abbreviation": "BOD"
                },
                {
                    "name": "Boulemane",
                    "abbreviation": "BOM"
                },
                {
                    "name": "Casablanca  [Dar el Beïda]",
                    "abbreviation": "CAS"
                },
                {
                    "name": "Chefchaouene",
                    "abbreviation": "CHE"
                },
                {
                    "name": "Chichaoua",
                    "abbreviation": "CHI"
                },
                {
                    "name": "El Hajeb",
                    "abbreviation": "HAJ"
                },
                {
                    "name": "El Jadida",
                    "abbreviation": "JDI"
                },
                {
                    "name": "Errachidia",
                    "abbreviation": "ERR"
                },
                {
                    "name": "Essaouira",
                    "abbreviation": "ESI"
                },
                {
                    "name": "Es Smara",
                    "abbreviation": "ESM"
                },
                {
                    "name": "Fès",
                    "abbreviation": "FES"
                },
                {
                    "name": "Figuig",
                    "abbreviation": "FIG"
                },
                {
                    "name": "Guelmim",
                    "abbreviation": "GUE"
                },
                {
                    "name": "Ifrane",
                    "abbreviation": "IFR"
                },
                {
                    "name": "Jerada",
                    "abbreviation": "JRA"
                },
                {
                    "name": "Kelaat Sraghna",
                    "abbreviation": "KES"
                },
                {
                    "name": "Kénitra",
                    "abbreviation": "KEN"
                },
                {
                    "name": "Khemisaet",
                    "abbreviation": "KHE"
                },
                {
                    "name": "Khenifra",
                    "abbreviation": "KHN"
                },
                {
                    "name": "Khouribga",
                    "abbreviation": "KHO"
                },
                {
                    "name": "Laâyoune (EH)",
                    "abbreviation": "LAA"
                },
                {
                    "name": "Larache",
                    "abbreviation": "LAP"
                },
                {
                    "name": "Marrakech",
                    "abbreviation": "MAR"
                },
                {
                    "name": "Meknsès",
                    "abbreviation": "MEK"
                },
                {
                    "name": "Nador",
                    "abbreviation": "NAD"
                },
                {
                    "name": "Ouarzazate",
                    "abbreviation": "OUA"
                },
                {
                    "name": "Oued ed Dahab (EH)",
                    "abbreviation": "OUD"
                },
                {
                    "name": "Oujda",
                    "abbreviation": "OUJ"
                },
                {
                    "name": "Rabat-Salé",
                    "abbreviation": "RBA"
                },
                {
                    "name": "Safi",
                    "abbreviation": "SAF"
                },
                {
                    "name": "Sefrou",
                    "abbreviation": "SEF"
                },
                {
                    "name": "Settat",
                    "abbreviation": "SET"
                },
                {
                    "name": "Sidl Kacem",
                    "abbreviation": "SIK"
                },
                {
                    "name": "Tanger",
                    "abbreviation": "TNG"
                },
                {
                    "name": "Tan-Tan",
                    "abbreviation": "TNT"
                },
                {
                    "name": "Taounate",
                    "abbreviation": "TAO"
                },
                {
                    "name": "Taroudannt",
                    "abbreviation": "TAR"
                },
                {
                    "name": "Tata",
                    "abbreviation": "TAT"
                },
                {
                    "name": "Taza",
                    "abbreviation": "TAZ"
                },
                {
                    "name": "Tétouan",
                    "abbreviation": "TET"
                },
                {
                    "name": "Tiznit",
                    "abbreviation": "TIZ"
                }
            ],
            "1147": [
                {
                    "name": "Maputo",
                    "abbreviation": "MPM"
                },
                {
                    "name": "Cabo Delgado",
                    "abbreviation": "P"
                },
                {
                    "name": "Gaza",
                    "abbreviation": "G"
                },
                {
                    "name": "Inhambane",
                    "abbreviation": "I"
                },
                {
                    "name": "Manica",
                    "abbreviation": "B"
                },
                {
                    "name": "Numpula",
                    "abbreviation": "N"
                },
                {
                    "name": "Niaaea",
                    "abbreviation": "A"
                },
                {
                    "name": "Sofala",
                    "abbreviation": "S"
                },
                {
                    "name": "Tete",
                    "abbreviation": "T"
                },
                {
                    "name": "Zambezia",
                    "abbreviation": "Q"
                }
            ],
            "1148": [
                {
                    "name": "Caprivi",
                    "abbreviation": "CA"
                },
                {
                    "name": "Erongo",
                    "abbreviation": "ER"
                },
                {
                    "name": "Hardap",
                    "abbreviation": "HA"
                },
                {
                    "name": "Karas",
                    "abbreviation": "KA"
                },
                {
                    "name": "Khomae",
                    "abbreviation": "KH"
                },
                {
                    "name": "Kunene",
                    "abbreviation": "KU"
                },
                {
                    "name": "Ohangwena",
                    "abbreviation": "OW"
                },
                {
                    "name": "Okavango",
                    "abbreviation": "OK"
                },
                {
                    "name": "Omaheke",
                    "abbreviation": "OH"
                },
                {
                    "name": "Omusati",
                    "abbreviation": "OS"
                },
                {
                    "name": "Oshana",
                    "abbreviation": "ON"
                },
                {
                    "name": "Oshikoto",
                    "abbreviation": "OT"
                },
                {
                    "name": "Otjozondjupa",
                    "abbreviation": "OD"
                }
            ],
            "1151": [
                {
                    "name": "Bonaire",
                    "abbreviation": "BON"
                },
                {
                    "name": "Curaçao",
                    "abbreviation": "CUR"
                },
                {
                    "name": "Saba",
                    "abbreviation": "SAB"
                },
                {
                    "name": "St. Eustatius",
                    "abbreviation": "EUA"
                },
                {
                    "name": "St. Maarten",
                    "abbreviation": "SXM"
                }
            ],
            "1152": [
                {
                    "name": "Drente",
                    "abbreviation": "DR"
                },
                {
                    "name": "Flevoland",
                    "abbreviation": "FL"
                },
                {
                    "name": "Friesland",
                    "abbreviation": "FR"
                },
                {
                    "name": "Gelderland",
                    "abbreviation": "GL"
                },
                {
                    "name": "Groningen",
                    "abbreviation": "GR"
                },
                {
                    "name": "Noord-Brabant",
                    "abbreviation": "NB"
                },
                {
                    "name": "Noord-Holland",
                    "abbreviation": "NH"
                },
                {
                    "name": "Overijssel",
                    "abbreviation": "OV"
                },
                {
                    "name": "Utrecht",
                    "abbreviation": "UT"
                },
                {
                    "name": "Zuid-Holland",
                    "abbreviation": "ZH"
                },
                {
                    "name": "Zeeland",
                    "abbreviation": "ZL"
                },
                {
                    "name": "Limburg",
                    "abbreviation": "LI"
                }
            ],
            "1154": [
                {
                    "name": "Auckland",
                    "abbreviation": "AUK"
                },
                {
                    "name": "Bay of Plenty",
                    "abbreviation": "BOP"
                },
                {
                    "name": "Canterbury",
                    "abbreviation": "CAN"
                },
                {
                    "name": "Gisborne",
                    "abbreviation": "GIS"
                },
                {
                    "name": "Hawkes Bay",
                    "abbreviation": "HKB"
                },
                {
                    "name": "Manawatu-Wanganui",
                    "abbreviation": "MWT"
                },
                {
                    "name": "Marlborough",
                    "abbreviation": "MBH"
                },
                {
                    "name": "Nelson",
                    "abbreviation": "NSN"
                },
                {
                    "name": "Northland",
                    "abbreviation": "NTL"
                },
                {
                    "name": "Otago",
                    "abbreviation": "OTA"
                },
                {
                    "name": "Southland",
                    "abbreviation": "STL"
                },
                {
                    "name": "Taranaki",
                    "abbreviation": "TKI"
                },
                {
                    "name": "Tasman",
                    "abbreviation": "TAS"
                },
                {
                    "name": "waikato",
                    "abbreviation": "WKO"
                },
                {
                    "name": "Wellington",
                    "abbreviation": "WGN"
                },
                {
                    "name": "West Coast",
                    "abbreviation": "WTC"
                }
            ],
            "1155": [
                {
                    "name": "Boaco",
                    "abbreviation": "BO"
                },
                {
                    "name": "Carazo",
                    "abbreviation": "CA"
                },
                {
                    "name": "Chinandega",
                    "abbreviation": "CI"
                },
                {
                    "name": "Chontales",
                    "abbreviation": "CO"
                },
                {
                    "name": "Esteli",
                    "abbreviation": "ES"
                },
                {
                    "name": "Jinotega",
                    "abbreviation": "JI"
                },
                {
                    "name": "Leon",
                    "abbreviation": "LE"
                },
                {
                    "name": "Madriz",
                    "abbreviation": "MD"
                },
                {
                    "name": "Managua",
                    "abbreviation": "MN"
                },
                {
                    "name": "Masaya",
                    "abbreviation": "MS"
                },
                {
                    "name": "Matagalpa",
                    "abbreviation": "MT"
                },
                {
                    "name": "Nueva Segovia",
                    "abbreviation": "NS"
                },
                {
                    "name": "Rio San Juan",
                    "abbreviation": "SJ"
                },
                {
                    "name": "Rivas",
                    "abbreviation": "RI"
                },
                {
                    "name": "Atlantico Norte",
                    "abbreviation": "AN"
                },
                {
                    "name": "Atlantico Sur",
                    "abbreviation": "AS"
                }
            ],
            "1156": [
                {
                    "name": "Niamey",
                    "abbreviation": "8"
                },
                {
                    "name": "Agadez",
                    "abbreviation": "1"
                },
                {
                    "name": "Diffa",
                    "abbreviation": "2"
                },
                {
                    "name": "Dosso",
                    "abbreviation": "3"
                },
                {
                    "name": "Maradi",
                    "abbreviation": "4"
                },
                {
                    "name": "Tahoua",
                    "abbreviation": "S"
                },
                {
                    "name": "Tillaberi",
                    "abbreviation": "6"
                },
                {
                    "name": "Zinder",
                    "abbreviation": "7"
                }
            ],
            "1157": [
                {
                    "name": "Abuja Capital Territory",
                    "abbreviation": "FC"
                },
                {
                    "name": "Abia",
                    "abbreviation": "AB"
                },
                {
                    "name": "Adamawa",
                    "abbreviation": "AD"
                },
                {
                    "name": "Akwa Ibom",
                    "abbreviation": "AK"
                },
                {
                    "name": "Anambra",
                    "abbreviation": "AN"
                },
                {
                    "name": "Bauchi",
                    "abbreviation": "BA"
                },
                {
                    "name": "Bayelsa",
                    "abbreviation": "BY"
                },
                {
                    "name": "Benue",
                    "abbreviation": "BE"
                },
                {
                    "name": "Borno",
                    "abbreviation": "BO"
                },
                {
                    "name": "Cross River",
                    "abbreviation": "CR"
                },
                {
                    "name": "Delta",
                    "abbreviation": "DE"
                },
                {
                    "name": "Ebonyi",
                    "abbreviation": "EB"
                },
                {
                    "name": "Edo",
                    "abbreviation": "ED"
                },
                {
                    "name": "Ekiti",
                    "abbreviation": "EK"
                },
                {
                    "name": "Enugu",
                    "abbreviation": "EN"
                },
                {
                    "name": "Gombe",
                    "abbreviation": "GO"
                },
                {
                    "name": "Imo",
                    "abbreviation": "IM"
                },
                {
                    "name": "Jigawa",
                    "abbreviation": "JI"
                },
                {
                    "name": "Kaduna",
                    "abbreviation": "KD"
                },
                {
                    "name": "Kano",
                    "abbreviation": "KN"
                },
                {
                    "name": "Katsina",
                    "abbreviation": "KT"
                },
                {
                    "name": "Kebbi",
                    "abbreviation": "KE"
                },
                {
                    "name": "Kogi",
                    "abbreviation": "KO"
                },
                {
                    "name": "Kwara",
                    "abbreviation": "KW"
                },
                {
                    "name": "Lagos",
                    "abbreviation": "LA"
                },
                {
                    "name": "Nassarawa",
                    "abbreviation": "NA"
                },
                {
                    "name": "Niger",
                    "abbreviation": "NI"
                },
                {
                    "name": "Ogun",
                    "abbreviation": "OG"
                },
                {
                    "name": "Ondo",
                    "abbreviation": "ON"
                },
                {
                    "name": "Osun",
                    "abbreviation": "OS"
                },
                {
                    "name": "Oyo",
                    "abbreviation": "OY"
                },
                {
                    "name": "Rivers",
                    "abbreviation": "RI"
                },
                {
                    "name": "Sokoto",
                    "abbreviation": "SO"
                },
                {
                    "name": "Taraba",
                    "abbreviation": "TA"
                },
                {
                    "name": "Yobe",
                    "abbreviation": "YO"
                },
                {
                    "name": "Zamfara",
                    "abbreviation": "ZA"
                }
            ],
            "1161": [
                {
                    "name": "Akershus",
                    "abbreviation": "02"
                },
                {
                    "name": "Aust-Agder",
                    "abbreviation": "09"
                },
                {
                    "name": "Buskerud",
                    "abbreviation": "06"
                },
                {
                    "name": "Finumark",
                    "abbreviation": "20"
                },
                {
                    "name": "Hedmark",
                    "abbreviation": "04"
                },
                {
                    "name": "Hordaland",
                    "abbreviation": "12"
                },
                {
                    "name": "Mire og Romsdal",
                    "abbreviation": "15"
                },
                {
                    "name": "Nordland",
                    "abbreviation": "18"
                },
                {
                    "name": "Nord-Trindelag",
                    "abbreviation": "17"
                },
                {
                    "name": "Oppland",
                    "abbreviation": "05"
                },
                {
                    "name": "Oslo",
                    "abbreviation": "03"
                },
                {
                    "name": "Rogaland",
                    "abbreviation": "11"
                },
                {
                    "name": "Sogn og Fjordane",
                    "abbreviation": "14"
                },
                {
                    "name": "Sir-Trindelag",
                    "abbreviation": "16"
                },
                {
                    "name": "Telemark",
                    "abbreviation": "06"
                },
                {
                    "name": "Troms",
                    "abbreviation": "19"
                },
                {
                    "name": "Vest-Agder",
                    "abbreviation": "10"
                },
                {
                    "name": "Vestfold",
                    "abbreviation": "07"
                },
                {
                    "name": "Ostfold",
                    "abbreviation": "01"
                },
                {
                    "name": "Jan Mayen",
                    "abbreviation": "22"
                },
                {
                    "name": "Svalbard",
                    "abbreviation": "21"
                }
            ],
            "1162": [
                {
                    "name": "Ad Dakhillyah",
                    "abbreviation": "DA"
                },
                {
                    "name": "Al Batinah",
                    "abbreviation": "BA"
                },
                {
                    "name": "Al Janblyah",
                    "abbreviation": "JA"
                },
                {
                    "name": "Al Wusta",
                    "abbreviation": "WU"
                },
                {
                    "name": "Ash Sharqlyah",
                    "abbreviation": "SH"
                },
                {
                    "name": "Az Zahirah",
                    "abbreviation": "ZA"
                },
                {
                    "name": "Masqat",
                    "abbreviation": "MA"
                },
                {
                    "name": "Musandam",
                    "abbreviation": "MU"
                }
            ],
            "1163": [
                {
                    "name": "Islamabad",
                    "abbreviation": "IS"
                },
                {
                    "name": "Baluchistan (en)",
                    "abbreviation": "BA"
                },
                {
                    "name": "North-West Frontier",
                    "abbreviation": "NW"
                },
                {
                    "name": "Sind (en)",
                    "abbreviation": "SD"
                },
                {
                    "name": "Federally Administered Tribal Aresa",
                    "abbreviation": "TA"
                },
                {
                    "name": "Azad Rashmir",
                    "abbreviation": "JK"
                },
                {
                    "name": "Northern Areas",
                    "abbreviation": "NA"
                }
            ],
            "1165": [
                {
                    "name": "Jenin",
                    "abbreviation": "_A"
                },
                {
                    "name": "Tubas",
                    "abbreviation": "_B"
                },
                {
                    "name": "Tulkarm",
                    "abbreviation": "_C"
                },
                {
                    "name": "Nablus",
                    "abbreviation": "_D"
                },
                {
                    "name": "Qalqilya",
                    "abbreviation": "_E"
                },
                {
                    "name": "Salfit",
                    "abbreviation": "_F"
                },
                {
                    "name": "Ramallah and Al-Bireh",
                    "abbreviation": "_G"
                },
                {
                    "name": "Jericho",
                    "abbreviation": "_H"
                },
                {
                    "name": "Jerusalem",
                    "abbreviation": "_I"
                },
                {
                    "name": "Bethlehem",
                    "abbreviation": "_J"
                },
                {
                    "name": "Hebron",
                    "abbreviation": "_K"
                },
                {
                    "name": "North Gaza",
                    "abbreviation": "_L"
                },
                {
                    "name": "Gaza",
                    "abbreviation": "_M"
                },
                {
                    "name": "Deir el-Balah",
                    "abbreviation": "_N"
                },
                {
                    "name": "Khan Yunis",
                    "abbreviation": "_O"
                },
                {
                    "name": "Rafah",
                    "abbreviation": "_P"
                }
            ],
            "1166": [
                {
                    "name": "Bocas del Toro",
                    "abbreviation": "1"
                },
                {
                    "name": "Cocle",
                    "abbreviation": "2"
                },
                {
                    "name": "Chiriqui",
                    "abbreviation": "4"
                },
                {
                    "name": "Darien",
                    "abbreviation": "5"
                },
                {
                    "name": "Herrera",
                    "abbreviation": "6"
                },
                {
                    "name": "Loa Santoa",
                    "abbreviation": "7"
                },
                {
                    "name": "Panama",
                    "abbreviation": "8"
                },
                {
                    "name": "Veraguas",
                    "abbreviation": "9"
                },
                {
                    "name": "Comarca de San Blas",
                    "abbreviation": "Q"
                }
            ],
            "1167": [
                {
                    "name": "National Capital District (Port Moresby)",
                    "abbreviation": "NCD"
                },
                {
                    "name": "Chimbu",
                    "abbreviation": "CPK"
                },
                {
                    "name": "Eastern Highlands",
                    "abbreviation": "EHG"
                },
                {
                    "name": "East New Britain",
                    "abbreviation": "EBR"
                },
                {
                    "name": "East Sepik",
                    "abbreviation": "ESW"
                },
                {
                    "name": "Enga",
                    "abbreviation": "EPW"
                },
                {
                    "name": "Gulf",
                    "abbreviation": "GPK"
                },
                {
                    "name": "Madang",
                    "abbreviation": "MPM"
                },
                {
                    "name": "Manus",
                    "abbreviation": "MRL"
                },
                {
                    "name": "Milne Bay",
                    "abbreviation": "MBA"
                },
                {
                    "name": "Morobe",
                    "abbreviation": "MPL"
                },
                {
                    "name": "New Ireland",
                    "abbreviation": "NIK"
                },
                {
                    "name": "North Solomons",
                    "abbreviation": "NSA"
                },
                {
                    "name": "Santaun",
                    "abbreviation": "SAN"
                },
                {
                    "name": "Southern Highlands",
                    "abbreviation": "SHM"
                },
                {
                    "name": "Western Highlands",
                    "abbreviation": "WHM"
                },
                {
                    "name": "West New Britain",
                    "abbreviation": "WBK"
                }
            ],
            "1168": [
                {
                    "name": "Asuncion",
                    "abbreviation": "ASU"
                },
                {
                    "name": "Alto Paraguay",
                    "abbreviation": "16"
                },
                {
                    "name": "Alto Parana",
                    "abbreviation": "10"
                },
                {
                    "name": "Amambay",
                    "abbreviation": "13"
                },
                {
                    "name": "Boqueron",
                    "abbreviation": "19"
                },
                {
                    "name": "Caeguazu",
                    "abbreviation": "5"
                },
                {
                    "name": "Caazapl",
                    "abbreviation": "6"
                },
                {
                    "name": "Canindeyu",
                    "abbreviation": "14"
                },
                {
                    "name": "Concepcion",
                    "abbreviation": "1"
                },
                {
                    "name": "Cordillera",
                    "abbreviation": "3"
                },
                {
                    "name": "Guaira",
                    "abbreviation": "4"
                },
                {
                    "name": "Itapua",
                    "abbreviation": "7"
                },
                {
                    "name": "Miaiones",
                    "abbreviation": "8"
                },
                {
                    "name": "Neembucu",
                    "abbreviation": "12"
                },
                {
                    "name": "Paraguari",
                    "abbreviation": "9"
                },
                {
                    "name": "Presidente Hayes",
                    "abbreviation": "15"
                },
                {
                    "name": "San Pedro",
                    "abbreviation": "2"
                }
            ],
            "1169": [
                {
                    "name": "El Callao",
                    "abbreviation": "CAL"
                },
                {
                    "name": "Ancash",
                    "abbreviation": "ANC"
                },
                {
                    "name": "Apurimac",
                    "abbreviation": "APU"
                },
                {
                    "name": "Arequipa",
                    "abbreviation": "ARE"
                },
                {
                    "name": "Ayacucho",
                    "abbreviation": "AYA"
                },
                {
                    "name": "Cajamarca",
                    "abbreviation": "CAJ"
                },
                {
                    "name": "Cuzco",
                    "abbreviation": "CUS"
                },
                {
                    "name": "Huancavelica",
                    "abbreviation": "HUV"
                },
                {
                    "name": "Huanuco",
                    "abbreviation": "HUC"
                },
                {
                    "name": "Ica",
                    "abbreviation": "ICA"
                },
                {
                    "name": "Junin",
                    "abbreviation": "JUN"
                },
                {
                    "name": "La Libertad",
                    "abbreviation": "LAL"
                },
                {
                    "name": "Lambayeque",
                    "abbreviation": "LAM"
                },
                {
                    "name": "Lima",
                    "abbreviation": "LIM"
                },
                {
                    "name": "Loreto",
                    "abbreviation": "LOR"
                },
                {
                    "name": "Madre de Dios",
                    "abbreviation": "MDD"
                },
                {
                    "name": "Moquegua",
                    "abbreviation": "MOQ"
                },
                {
                    "name": "Pasco",
                    "abbreviation": "PAS"
                },
                {
                    "name": "Piura",
                    "abbreviation": "PIU"
                },
                {
                    "name": "Puno",
                    "abbreviation": "PUN"
                },
                {
                    "name": "San Martin",
                    "abbreviation": "SAM"
                },
                {
                    "name": "Tacna",
                    "abbreviation": "TAC"
                },
                {
                    "name": "Tumbes",
                    "abbreviation": "TUM"
                },
                {
                    "name": "Ucayali",
                    "abbreviation": "UCA"
                }
            ],
            "1170": [
                {
                    "name": "Abra",
                    "abbreviation": "ABR"
                },
                {
                    "name": "Agusan del Norte",
                    "abbreviation": "AGN"
                },
                {
                    "name": "Agusan del Sur",
                    "abbreviation": "AGS"
                },
                {
                    "name": "Aklan",
                    "abbreviation": "AKL"
                },
                {
                    "name": "Albay",
                    "abbreviation": "ALB"
                },
                {
                    "name": "Antique",
                    "abbreviation": "ANT"
                },
                {
                    "name": "Apayao",
                    "abbreviation": "APA"
                },
                {
                    "name": "Aurora",
                    "abbreviation": "AUR"
                },
                {
                    "name": "Basilan",
                    "abbreviation": "BAS"
                },
                {
                    "name": "Batasn",
                    "abbreviation": "BAN"
                },
                {
                    "name": "Batanes",
                    "abbreviation": "BTN"
                },
                {
                    "name": "Batangas",
                    "abbreviation": "BTG"
                },
                {
                    "name": "Benguet",
                    "abbreviation": "BEN"
                },
                {
                    "name": "Biliran",
                    "abbreviation": "BIL"
                },
                {
                    "name": "Bohol",
                    "abbreviation": "BOH"
                },
                {
                    "name": "Bukidnon",
                    "abbreviation": "BUK"
                },
                {
                    "name": "Bulacan",
                    "abbreviation": "BUL"
                },
                {
                    "name": "Cagayan",
                    "abbreviation": "CAG"
                },
                {
                    "name": "Camarines Norte",
                    "abbreviation": "CAN"
                },
                {
                    "name": "Camarines Sur",
                    "abbreviation": "CAS"
                },
                {
                    "name": "Camiguin",
                    "abbreviation": "CAM"
                },
                {
                    "name": "Capiz",
                    "abbreviation": "CAP"
                },
                {
                    "name": "Catanduanes",
                    "abbreviation": "CAT"
                },
                {
                    "name": "Cavite",
                    "abbreviation": "CAV"
                },
                {
                    "name": "Cebu",
                    "abbreviation": "CEB"
                },
                {
                    "name": "Compostela Valley",
                    "abbreviation": "COM"
                },
                {
                    "name": "Davao",
                    "abbreviation": "DAV"
                },
                {
                    "name": "Davao del Sur",
                    "abbreviation": "DAS"
                },
                {
                    "name": "Davao Oriental",
                    "abbreviation": "DAO"
                },
                {
                    "name": "Eastern Samar",
                    "abbreviation": "EAS"
                },
                {
                    "name": "Guimaras",
                    "abbreviation": "GUI"
                },
                {
                    "name": "Ifugao",
                    "abbreviation": "IFU"
                },
                {
                    "name": "Ilocos Norte",
                    "abbreviation": "ILN"
                },
                {
                    "name": "Ilocos Sur",
                    "abbreviation": "ILS"
                },
                {
                    "name": "Iloilo",
                    "abbreviation": "ILI"
                },
                {
                    "name": "Isabela",
                    "abbreviation": "ISA"
                },
                {
                    "name": "Kalinga-Apayso",
                    "abbreviation": "KAL"
                },
                {
                    "name": "Laguna",
                    "abbreviation": "LAG"
                },
                {
                    "name": "Lanao del Norte",
                    "abbreviation": "LAN"
                },
                {
                    "name": "Lanao del Sur",
                    "abbreviation": "LAS"
                },
                {
                    "name": "La Union",
                    "abbreviation": "LUN"
                },
                {
                    "name": "Leyte",
                    "abbreviation": "LEY"
                },
                {
                    "name": "Maguindanao",
                    "abbreviation": "MAG"
                },
                {
                    "name": "Marinduque",
                    "abbreviation": "MAD"
                },
                {
                    "name": "Masbate",
                    "abbreviation": "MAS"
                },
                {
                    "name": "Mindoro Occidental",
                    "abbreviation": "MDC"
                },
                {
                    "name": "Mindoro Oriental",
                    "abbreviation": "MDR"
                },
                {
                    "name": "Misamis Occidental",
                    "abbreviation": "MSC"
                },
                {
                    "name": "Misamis Oriental",
                    "abbreviation": "MSR"
                },
                {
                    "name": "Mountain Province",
                    "abbreviation": "MOU"
                },
                {
                    "name": "Negroe Occidental",
                    "abbreviation": "NEC"
                },
                {
                    "name": "Negros Oriental",
                    "abbreviation": "NER"
                },
                {
                    "name": "North Cotabato",
                    "abbreviation": "NCO"
                },
                {
                    "name": "Northern Samar",
                    "abbreviation": "NSA"
                },
                {
                    "name": "Nueva Ecija",
                    "abbreviation": "NUE"
                },
                {
                    "name": "Nueva Vizcaya",
                    "abbreviation": "NUV"
                },
                {
                    "name": "Palawan",
                    "abbreviation": "PLW"
                },
                {
                    "name": "Pampanga",
                    "abbreviation": "PAM"
                },
                {
                    "name": "Pangasinan",
                    "abbreviation": "PAN"
                },
                {
                    "name": "Quezon",
                    "abbreviation": "QUE"
                },
                {
                    "name": "Quirino",
                    "abbreviation": "QUI"
                },
                {
                    "name": "Rizal",
                    "abbreviation": "RIZ"
                },
                {
                    "name": "Romblon",
                    "abbreviation": "ROM"
                },
                {
                    "name": "Sarangani",
                    "abbreviation": "SAR"
                },
                {
                    "name": "Siquijor",
                    "abbreviation": "SIG"
                },
                {
                    "name": "Sorsogon",
                    "abbreviation": "SOR"
                },
                {
                    "name": "South Cotabato",
                    "abbreviation": "SCO"
                },
                {
                    "name": "Southern Leyte",
                    "abbreviation": "SLE"
                },
                {
                    "name": "Sultan Kudarat",
                    "abbreviation": "SUK"
                },
                {
                    "name": "Sulu",
                    "abbreviation": "SLU"
                },
                {
                    "name": "Surigao del Norte",
                    "abbreviation": "SUN"
                },
                {
                    "name": "Surigao del Sur",
                    "abbreviation": "SUR"
                },
                {
                    "name": "Tarlac",
                    "abbreviation": "TAR"
                },
                {
                    "name": "Tawi-Tawi",
                    "abbreviation": "TAW"
                },
                {
                    "name": "Western Samar",
                    "abbreviation": "WSA"
                },
                {
                    "name": "Zambales",
                    "abbreviation": "ZMB"
                },
                {
                    "name": "Zamboanga del Norte",
                    "abbreviation": "ZAN"
                },
                {
                    "name": "Zamboanga del Sur",
                    "abbreviation": "ZAS"
                },
                {
                    "name": "Zamboanga Sibiguey",
                    "abbreviation": "ZSI"
                }
            ],
            "1172": [
                {
                    "name": "mazowieckie",
                    "abbreviation": "MZ"
                },
                {
                    "name": "pomorskie",
                    "abbreviation": "PM"
                },
                {
                    "name": "dolnośląskie",
                    "abbreviation": "DS"
                },
                {
                    "name": "kujawsko-pomorskie",
                    "abbreviation": "KP"
                },
                {
                    "name": "lubelskie",
                    "abbreviation": "LU"
                },
                {
                    "name": "lubuskie",
                    "abbreviation": "LB"
                },
                {
                    "name": "łódzkie",
                    "abbreviation": "LD"
                },
                {
                    "name": "małopolskie",
                    "abbreviation": "MA"
                },
                {
                    "name": "opolskie",
                    "abbreviation": "OP"
                },
                {
                    "name": "podkarpackie",
                    "abbreviation": "PK"
                },
                {
                    "name": "podlaskie",
                    "abbreviation": "PD"
                },
                {
                    "name": "śląskie",
                    "abbreviation": "SL"
                },
                {
                    "name": "świętokrzyskie",
                    "abbreviation": "SK"
                },
                {
                    "name": "warmińsko-mazurskie",
                    "abbreviation": "WN"
                },
                {
                    "name": "wielkopolskie",
                    "abbreviation": "WP"
                },
                {
                    "name": "zachodniopomorskie",
                    "abbreviation": "ZP"
                }
            ],
            "1173": [
                {
                    "name": "Aveiro",
                    "abbreviation": "01"
                },
                {
                    "name": "Beja",
                    "abbreviation": "02"
                },
                {
                    "name": "Braga",
                    "abbreviation": "03"
                },
                {
                    "name": "Braganca",
                    "abbreviation": "04"
                },
                {
                    "name": "Castelo Branco",
                    "abbreviation": "05"
                },
                {
                    "name": "Colmbra",
                    "abbreviation": "06"
                },
                {
                    "name": "Ovora",
                    "abbreviation": "07"
                },
                {
                    "name": "Faro",
                    "abbreviation": "08"
                },
                {
                    "name": "Guarda",
                    "abbreviation": "09"
                },
                {
                    "name": "Leiria",
                    "abbreviation": "10"
                },
                {
                    "name": "Lisboa",
                    "abbreviation": "11"
                },
                {
                    "name": "Portalegre",
                    "abbreviation": "12"
                },
                {
                    "name": "Porto",
                    "abbreviation": "13"
                },
                {
                    "name": "Santarem",
                    "abbreviation": "14"
                },
                {
                    "name": "Setubal",
                    "abbreviation": "15"
                },
                {
                    "name": "Viana do Castelo",
                    "abbreviation": "16"
                },
                {
                    "name": "Vila Real",
                    "abbreviation": "17"
                },
                {
                    "name": "Viseu",
                    "abbreviation": "18"
                },
                {
                    "name": "Regiao Autonoma dos Acores",
                    "abbreviation": "20"
                },
                {
                    "name": "Regiao Autonoma da Madeira",
                    "abbreviation": "30"
                }
            ],
            "1175": [
                {
                    "name": "Ad Dawhah",
                    "abbreviation": "DA"
                },
                {
                    "name": "Al Ghuwayriyah",
                    "abbreviation": "GH"
                },
                {
                    "name": "Al Jumayliyah",
                    "abbreviation": "JU"
                },
                {
                    "name": "Al Khawr",
                    "abbreviation": "KH"
                },
                {
                    "name": "Al Wakrah",
                    "abbreviation": "WA"
                },
                {
                    "name": "Ar Rayyan",
                    "abbreviation": "RA"
                },
                {
                    "name": "Jariyan al Batnah",
                    "abbreviation": "JB"
                },
                {
                    "name": "Madinat ash Shamal",
                    "abbreviation": "MS"
                },
                {
                    "name": "Umm Salal",
                    "abbreviation": "US"
                }
            ],
            "1176": [
                {
                    "name": "Bucuresti",
                    "abbreviation": "B"
                },
                {
                    "name": "Alba",
                    "abbreviation": "AB"
                },
                {
                    "name": "Arad",
                    "abbreviation": "AR"
                },
                {
                    "name": "Arges",
                    "abbreviation": "AG"
                },
                {
                    "name": "Bacau",
                    "abbreviation": "BC"
                },
                {
                    "name": "Bihor",
                    "abbreviation": "BH"
                },
                {
                    "name": "Bistrita-Nasaud",
                    "abbreviation": "BN"
                },
                {
                    "name": "Boto'ani",
                    "abbreviation": "BT"
                },
                {
                    "name": "Bra'ov",
                    "abbreviation": "BV"
                },
                {
                    "name": "Braila",
                    "abbreviation": "BR"
                },
                {
                    "name": "Buzau",
                    "abbreviation": "BZ"
                },
                {
                    "name": "Caras-Severin",
                    "abbreviation": "CS"
                },
                {
                    "name": "Ca la ras'i",
                    "abbreviation": "CL"
                },
                {
                    "name": "Cluj",
                    "abbreviation": "CJ"
                },
                {
                    "name": "Constant'a",
                    "abbreviation": "CT"
                },
                {
                    "name": "Covasna",
                    "abbreviation": "CV"
                },
                {
                    "name": "Dambovit'a",
                    "abbreviation": "DB"
                },
                {
                    "name": "Dolj",
                    "abbreviation": "DJ"
                },
                {
                    "name": "Galat'i",
                    "abbreviation": "GL"
                },
                {
                    "name": "Giurgiu",
                    "abbreviation": "GR"
                },
                {
                    "name": "Gorj",
                    "abbreviation": "GJ"
                },
                {
                    "name": "Harghita",
                    "abbreviation": "HR"
                },
                {
                    "name": "Hunedoara",
                    "abbreviation": "HD"
                },
                {
                    "name": "Ialomit'a",
                    "abbreviation": "IL"
                },
                {
                    "name": "Ias'i",
                    "abbreviation": "IS"
                },
                {
                    "name": "Ilfov",
                    "abbreviation": "IF"
                },
                {
                    "name": "Maramures",
                    "abbreviation": "MM"
                },
                {
                    "name": "Mehedint'i",
                    "abbreviation": "MH"
                },
                {
                    "name": "Mures",
                    "abbreviation": "MS"
                },
                {
                    "name": "Neamt",
                    "abbreviation": "NT"
                },
                {
                    "name": "Olt",
                    "abbreviation": "OT"
                },
                {
                    "name": "Prahova",
                    "abbreviation": "PH"
                },
                {
                    "name": "Satu Mare",
                    "abbreviation": "SM"
                },
                {
                    "name": "Sa laj",
                    "abbreviation": "SJ"
                },
                {
                    "name": "Sibiu",
                    "abbreviation": "SB"
                },
                {
                    "name": "Suceava",
                    "abbreviation": "SV"
                },
                {
                    "name": "Teleorman",
                    "abbreviation": "TR"
                },
                {
                    "name": "Timis",
                    "abbreviation": "TM"
                },
                {
                    "name": "Tulcea",
                    "abbreviation": "TL"
                },
                {
                    "name": "Vaslui",
                    "abbreviation": "VS"
                },
                {
                    "name": "Valcea",
                    "abbreviation": "VL"
                },
                {
                    "name": "Vrancea",
                    "abbreviation": "VN"
                }
            ],
            "1177": [
                {
                    "name": "Adygeya, Respublika",
                    "abbreviation": "AD"
                },
                {
                    "name": "Altay, Respublika",
                    "abbreviation": "AL"
                },
                {
                    "name": "Bashkortostan, Respublika",
                    "abbreviation": "BA"
                },
                {
                    "name": "Buryatiya, Respublika",
                    "abbreviation": "BU"
                },
                {
                    "name": "Chechenskaya Respublika",
                    "abbreviation": "CE"
                },
                {
                    "name": "Chuvashskaya Respublika",
                    "abbreviation": "CU"
                },
                {
                    "name": "Dagestan, Respublika",
                    "abbreviation": "DA"
                },
                {
                    "name": "Ingushskaya Respublika",
                    "abbreviation": "IN"
                },
                {
                    "name": "Kabardino-Balkarskaya",
                    "abbreviation": "KB"
                },
                {
                    "name": "Kalmykiya, Respublika",
                    "abbreviation": "KL"
                },
                {
                    "name": "Karachayevo-Cherkesskaya Respublika",
                    "abbreviation": "KC"
                },
                {
                    "name": "Kareliya, Respublika",
                    "abbreviation": "KR"
                },
                {
                    "name": "Khakasiya, Respublika",
                    "abbreviation": "KK"
                },
                {
                    "name": "Komi, Respublika",
                    "abbreviation": "KO"
                },
                {
                    "name": "Mariy El, Respublika",
                    "abbreviation": "ME"
                },
                {
                    "name": "Mordoviya, Respublika",
                    "abbreviation": "MO"
                },
                {
                    "name": "Sakha, Respublika [Yakutiya]",
                    "abbreviation": "SA"
                },
                {
                    "name": "Severnaya Osetiya, Respublika",
                    "abbreviation": "SE"
                },
                {
                    "name": "Tatarstan, Respublika",
                    "abbreviation": "TA"
                },
                {
                    "name": "Tyva, Respublika [Tuva]",
                    "abbreviation": "TY"
                },
                {
                    "name": "Udmurtskaya Respublika",
                    "abbreviation": "UD"
                },
                {
                    "name": "Altayskiy kray",
                    "abbreviation": "ALT"
                },
                {
                    "name": "Khabarovskiy kray",
                    "abbreviation": "KHA"
                },
                {
                    "name": "Krasnodarskiy kray",
                    "abbreviation": "KDA"
                },
                {
                    "name": "Krasnoyarskiy kray",
                    "abbreviation": "KYA"
                },
                {
                    "name": "Primorskiy kray",
                    "abbreviation": "PRI"
                },
                {
                    "name": "Stavropol'skiy kray",
                    "abbreviation": "STA"
                },
                {
                    "name": "Amurskaya oblast'",
                    "abbreviation": "AMU"
                },
                {
                    "name": "Arkhangel'skaya oblast'",
                    "abbreviation": "ARK"
                },
                {
                    "name": "Astrakhanskaya oblast'",
                    "abbreviation": "AST"
                },
                {
                    "name": "Belgorodskaya oblast'",
                    "abbreviation": "BEL"
                },
                {
                    "name": "Bryanskaya oblast'",
                    "abbreviation": "BRY"
                },
                {
                    "name": "Chelyabinskaya oblast'",
                    "abbreviation": "CHE"
                },
                {
                    "name": "Chitinskaya oblast'",
                    "abbreviation": "CHI"
                },
                {
                    "name": "Irkutskaya oblast'",
                    "abbreviation": "IRK"
                },
                {
                    "name": "Ivanovskaya oblast'",
                    "abbreviation": "IVA"
                },
                {
                    "name": "Kaliningradskaya oblast'",
                    "abbreviation": "KGD"
                },
                {
                    "name": "Kaluzhskaya oblast'",
                    "abbreviation": "KLU"
                },
                {
                    "name": "Kamchatskaya oblast'",
                    "abbreviation": "KAM"
                },
                {
                    "name": "Kemerovskaya oblast'",
                    "abbreviation": "KEM"
                },
                {
                    "name": "Kirovskaya oblast'",
                    "abbreviation": "KIR"
                },
                {
                    "name": "Kostromskaya oblast'",
                    "abbreviation": "KOS"
                },
                {
                    "name": "Kurganskaya oblast'",
                    "abbreviation": "KGN"
                },
                {
                    "name": "Kurskaya oblast'",
                    "abbreviation": "KRS"
                },
                {
                    "name": "Leningradskaya oblast'",
                    "abbreviation": "LEN"
                },
                {
                    "name": "Lipetskaya oblast'",
                    "abbreviation": "LIP"
                },
                {
                    "name": "Magadanskaya oblast'",
                    "abbreviation": "MAG"
                },
                {
                    "name": "Moskovskaya oblast'",
                    "abbreviation": "MOS"
                },
                {
                    "name": "Murmanskaya oblast'",
                    "abbreviation": "MUR"
                },
                {
                    "name": "Nizhegorodskaya oblast'",
                    "abbreviation": "NIZ"
                },
                {
                    "name": "Novgorodskaya oblast'",
                    "abbreviation": "NGR"
                },
                {
                    "name": "Novosibirskaya oblast'",
                    "abbreviation": "NVS"
                },
                {
                    "name": "Omskaya oblast'",
                    "abbreviation": "OMS"
                },
                {
                    "name": "Orenburgskaya oblast'",
                    "abbreviation": "ORE"
                },
                {
                    "name": "Orlovskaya oblast'",
                    "abbreviation": "ORL"
                },
                {
                    "name": "Penzenskaya oblast'",
                    "abbreviation": "PNZ"
                },
                {
                    "name": "Permskaya oblast'",
                    "abbreviation": "PER"
                },
                {
                    "name": "Pskovskaya oblast'",
                    "abbreviation": "PSK"
                },
                {
                    "name": "Rostovskaya oblast'",
                    "abbreviation": "ROS"
                },
                {
                    "name": "Ryazanskaya oblast'",
                    "abbreviation": "RYA"
                },
                {
                    "name": "Sakhalinskaya oblast'",
                    "abbreviation": "SAK"
                },
                {
                    "name": "Samarskaya oblast'",
                    "abbreviation": "SAM"
                },
                {
                    "name": "Saratovskaya oblast'",
                    "abbreviation": "SAR"
                },
                {
                    "name": "Smolenskaya oblast'",
                    "abbreviation": "SMO"
                },
                {
                    "name": "Sverdlovskaya oblast'",
                    "abbreviation": "SVE"
                },
                {
                    "name": "Tambovskaya oblast'",
                    "abbreviation": "TAM"
                },
                {
                    "name": "Tomskaya oblast'",
                    "abbreviation": "TOM"
                },
                {
                    "name": "Tul'skaya oblast'",
                    "abbreviation": "TUL"
                },
                {
                    "name": "Tverskaya oblast'",
                    "abbreviation": "TVE"
                },
                {
                    "name": "Tyumenskaya oblast'",
                    "abbreviation": "TYU"
                },
                {
                    "name": "Ul'yanovskaya oblast'",
                    "abbreviation": "ULY"
                },
                {
                    "name": "Vladimirskaya oblast'",
                    "abbreviation": "VLA"
                },
                {
                    "name": "Volgogradskaya oblast'",
                    "abbreviation": "VGG"
                },
                {
                    "name": "Vologodskaya oblast'",
                    "abbreviation": "VLG"
                },
                {
                    "name": "Voronezhskaya oblast'",
                    "abbreviation": "VOR"
                },
                {
                    "name": "Yaroslavskaya oblast'",
                    "abbreviation": "YAR"
                },
                {
                    "name": "Moskva",
                    "abbreviation": "MOW"
                },
                {
                    "name": "Sankt-Peterburg",
                    "abbreviation": "SPE"
                },
                {
                    "name": "Yevreyskaya avtonomnaya oblast'",
                    "abbreviation": "YEV"
                },
                {
                    "name": "Aginskiy Buryatskiy avtonomnyy",
                    "abbreviation": "AGB"
                },
                {
                    "name": "Chukotskiy avtonomnyy okrug",
                    "abbreviation": "CHU"
                },
                {
                    "name": "Evenkiyskiy avtonomnyy okrug",
                    "abbreviation": "EVE"
                },
                {
                    "name": "Khanty-Mansiyskiy avtonomnyy okrug",
                    "abbreviation": "KHM"
                },
                {
                    "name": "Komi-Permyatskiy avtonomnyy okrug",
                    "abbreviation": "KOP"
                },
                {
                    "name": "Koryakskiy avtonomnyy okrug",
                    "abbreviation": "KOR"
                },
                {
                    "name": "Nenetskiy avtonomnyy okrug",
                    "abbreviation": "NEN"
                },
                {
                    "name": "Taymyrskiy (Dolgano-Nenetskiy)",
                    "abbreviation": "TAY"
                },
                {
                    "name": "Ust'-Ordynskiy Buryatskiy",
                    "abbreviation": "UOB"
                },
                {
                    "name": "Yamalo-Nenetskiy avtonomnyy okrug",
                    "abbreviation": "YAN"
                }
            ],
            "1178": [
                {
                    "name": "Butare",
                    "abbreviation": "C"
                },
                {
                    "name": "Byumba",
                    "abbreviation": "I"
                },
                {
                    "name": "Cyangugu",
                    "abbreviation": "E"
                },
                {
                    "name": "Gikongoro",
                    "abbreviation": "D"
                },
                {
                    "name": "Gisenyi",
                    "abbreviation": "G"
                },
                {
                    "name": "Gitarama",
                    "abbreviation": "B"
                },
                {
                    "name": "Kibungo",
                    "abbreviation": "J"
                },
                {
                    "name": "Kibuye",
                    "abbreviation": "F"
                },
                {
                    "name": "Kigali-Rural Kigali y' Icyaro",
                    "abbreviation": "K"
                },
                {
                    "name": "Kigali-Ville Kigali Ngari",
                    "abbreviation": "L"
                },
                {
                    "name": "Mutara",
                    "abbreviation": "M"
                },
                {
                    "name": "Ruhengeri",
                    "abbreviation": "H"
                }
            ],
            "1180": [
                {
                    "name": "Saint Helena",
                    "abbreviation": "SH"
                },
                {
                    "name": "Ascension",
                    "abbreviation": "AC"
                },
                {
                    "name": "Tristan da Cunha",
                    "abbreviation": "TA"
                }
            ],
            "1185": [
                {
                    "name": "A'ana",
                    "abbreviation": "AA"
                },
                {
                    "name": "Aiga-i-le-Tai",
                    "abbreviation": "AL"
                },
                {
                    "name": "Atua",
                    "abbreviation": "AT"
                },
                {
                    "name": "Fa'aaaleleaga",
                    "abbreviation": "FA"
                },
                {
                    "name": "Gaga'emauga",
                    "abbreviation": "GE"
                },
                {
                    "name": "Gagaifomauga",
                    "abbreviation": "GI"
                },
                {
                    "name": "Palauli",
                    "abbreviation": "PA"
                },
                {
                    "name": "Satupa'itea",
                    "abbreviation": "SA"
                },
                {
                    "name": "Tuamasaga",
                    "abbreviation": "TU"
                },
                {
                    "name": "Va'a-o-Fonoti",
                    "abbreviation": "VF"
                },
                {
                    "name": "Vaisigano",
                    "abbreviation": "VS"
                }
            ],
            "1187": [
                {
                    "name": "Al Batah",
                    "abbreviation": "11"
                },
                {
                    "name": "Al H,udd ash Shamallyah",
                    "abbreviation": "08"
                },
                {
                    "name": "Al Jawf",
                    "abbreviation": "12"
                },
                {
                    "name": "Al Madinah",
                    "abbreviation": "03"
                },
                {
                    "name": "Al Qasim",
                    "abbreviation": "05"
                },
                {
                    "name": "Ar Riyad",
                    "abbreviation": "01"
                },
                {
                    "name": "Asir",
                    "abbreviation": "14"
                },
                {
                    "name": "Ha'il",
                    "abbreviation": "06"
                },
                {
                    "name": "Jlzan",
                    "abbreviation": "09"
                },
                {
                    "name": "Makkah",
                    "abbreviation": "02"
                },
                {
                    "name": "Najran",
                    "abbreviation": "10"
                },
                {
                    "name": "Tabuk",
                    "abbreviation": "07"
                }
            ],
            "1188": [
                {
                    "name": "Dakar",
                    "abbreviation": "DK"
                },
                {
                    "name": "Diourbel",
                    "abbreviation": "DB"
                },
                {
                    "name": "Fatick",
                    "abbreviation": "FK"
                },
                {
                    "name": "Kaolack",
                    "abbreviation": "KL"
                },
                {
                    "name": "Kolda",
                    "abbreviation": "KD"
                },
                {
                    "name": "Louga",
                    "abbreviation": "LG"
                },
                {
                    "name": "Matam",
                    "abbreviation": "MT"
                },
                {
                    "name": "Saint-Louis",
                    "abbreviation": "SL"
                },
                {
                    "name": "Tambacounda",
                    "abbreviation": "TC"
                },
                {
                    "name": "Thies",
                    "abbreviation": "TH"
                },
                {
                    "name": "Ziguinchor",
                    "abbreviation": "ZG"
                }
            ],
            "1190": [
                {
                    "name": "Western Area (Freetown)",
                    "abbreviation": "W"
                }
            ],
            "1192": [
                {
                    "name": "Banskobystrický kraj",
                    "abbreviation": "BC"
                },
                {
                    "name": "Bratislavský kraj",
                    "abbreviation": "BL"
                },
                {
                    "name": "Košický kraj",
                    "abbreviation": "KI"
                },
                {
                    "name": "Nitriansky kraj",
                    "abbreviation": "NJ"
                },
                {
                    "name": "Prešovský kraj",
                    "abbreviation": "PV"
                },
                {
                    "name": "Trenčiansky kraj",
                    "abbreviation": "TC"
                },
                {
                    "name": "Trnavský kraj",
                    "abbreviation": "TA"
                },
                {
                    "name": "Žilinský kraj",
                    "abbreviation": "ZI"
                }
            ],
            "1193": [
                {
                    "name": "Ajdovscina",
                    "abbreviation": "001"
                },
                {
                    "name": "Beltinci",
                    "abbreviation": "002"
                },
                {
                    "name": "Benedikt",
                    "abbreviation": "148"
                },
                {
                    "name": "Bistrica ob Sotli",
                    "abbreviation": "149"
                },
                {
                    "name": "Bled",
                    "abbreviation": "003"
                },
                {
                    "name": "Bloke",
                    "abbreviation": "150"
                },
                {
                    "name": "Bohinj",
                    "abbreviation": "004"
                },
                {
                    "name": "Borovnica",
                    "abbreviation": "005"
                },
                {
                    "name": "Bovec",
                    "abbreviation": "006"
                },
                {
                    "name": "Braslovce",
                    "abbreviation": "151"
                },
                {
                    "name": "Brda",
                    "abbreviation": "007"
                },
                {
                    "name": "Brezovica",
                    "abbreviation": "008"
                },
                {
                    "name": "Brezica",
                    "abbreviation": "009"
                },
                {
                    "name": "Cankova",
                    "abbreviation": "152"
                },
                {
                    "name": "Celje",
                    "abbreviation": "011"
                },
                {
                    "name": "Cerklje na Gorenjskem",
                    "abbreviation": "012"
                },
                {
                    "name": "Cerknica",
                    "abbreviation": "013"
                },
                {
                    "name": "Cerkno",
                    "abbreviation": "014"
                },
                {
                    "name": "Cerkvenjak",
                    "abbreviation": "153"
                },
                {
                    "name": "Crensovci",
                    "abbreviation": "015"
                },
                {
                    "name": "Crna na Koroskem",
                    "abbreviation": "016"
                },
                {
                    "name": "Crnomelj",
                    "abbreviation": "017"
                },
                {
                    "name": "Destrnik",
                    "abbreviation": "018"
                },
                {
                    "name": "Divaca",
                    "abbreviation": "019"
                },
                {
                    "name": "Dobje",
                    "abbreviation": "154"
                },
                {
                    "name": "Dobrepolje",
                    "abbreviation": "020"
                },
                {
                    "name": "Dobrna",
                    "abbreviation": "155"
                },
                {
                    "name": "Dobrova-Polhov Gradec",
                    "abbreviation": "021"
                },
                {
                    "name": "Dobrovnik",
                    "abbreviation": "156"
                },
                {
                    "name": "Dol pri Ljubljani",
                    "abbreviation": "022"
                },
                {
                    "name": "Dolenjske Toplice",
                    "abbreviation": "157"
                },
                {
                    "name": "Domzale",
                    "abbreviation": "023"
                },
                {
                    "name": "Dornava",
                    "abbreviation": "024"
                },
                {
                    "name": "Dravograd",
                    "abbreviation": "025"
                },
                {
                    "name": "Duplek",
                    "abbreviation": "026"
                },
                {
                    "name": "Gorenja vas-Poljane",
                    "abbreviation": "027"
                },
                {
                    "name": "Gorsnica",
                    "abbreviation": "028"
                },
                {
                    "name": "Gornja Radgona",
                    "abbreviation": "029"
                },
                {
                    "name": "Gornji Grad",
                    "abbreviation": "030"
                },
                {
                    "name": "Gornji Petrovci",
                    "abbreviation": "031"
                },
                {
                    "name": "Grad",
                    "abbreviation": "158"
                },
                {
                    "name": "Grosuplje",
                    "abbreviation": "032"
                },
                {
                    "name": "Hajdina",
                    "abbreviation": "159"
                },
                {
                    "name": "Hoce-Slivnica",
                    "abbreviation": "160"
                },
                {
                    "name": "Hodos",
                    "abbreviation": "161"
                },
                {
                    "name": "Jorjul",
                    "abbreviation": "162"
                },
                {
                    "name": "Hrastnik",
                    "abbreviation": "034"
                },
                {
                    "name": "Hrpelje-Kozina",
                    "abbreviation": "035"
                },
                {
                    "name": "Idrija",
                    "abbreviation": "036"
                },
                {
                    "name": "Ig",
                    "abbreviation": "037"
                },
                {
                    "name": "IIrska Bistrica",
                    "abbreviation": "038"
                },
                {
                    "name": "Ivancna Gorica",
                    "abbreviation": "039"
                },
                {
                    "name": "Izola",
                    "abbreviation": "040"
                },
                {
                    "name": "Jesenice",
                    "abbreviation": "041"
                },
                {
                    "name": "Jezersko",
                    "abbreviation": "163"
                },
                {
                    "name": "Jursinci",
                    "abbreviation": "042"
                },
                {
                    "name": "Kamnik",
                    "abbreviation": "043"
                },
                {
                    "name": "Kanal",
                    "abbreviation": "044"
                },
                {
                    "name": "Kidricevo",
                    "abbreviation": "045"
                },
                {
                    "name": "Kobarid",
                    "abbreviation": "046"
                },
                {
                    "name": "Kobilje",
                    "abbreviation": "047"
                },
                {
                    "name": "Jovevje",
                    "abbreviation": "048"
                },
                {
                    "name": "Komen",
                    "abbreviation": "049"
                },
                {
                    "name": "Komenda",
                    "abbreviation": "164"
                },
                {
                    "name": "Koper",
                    "abbreviation": "050"
                },
                {
                    "name": "Kostel",
                    "abbreviation": "165"
                },
                {
                    "name": "Kozje",
                    "abbreviation": "051"
                },
                {
                    "name": "Kranj",
                    "abbreviation": "052"
                },
                {
                    "name": "Kranjska Gora",
                    "abbreviation": "053"
                },
                {
                    "name": "Krizevci",
                    "abbreviation": "166"
                },
                {
                    "name": "Krsko",
                    "abbreviation": "054"
                },
                {
                    "name": "Kungota",
                    "abbreviation": "055"
                },
                {
                    "name": "Kuzma",
                    "abbreviation": "056"
                },
                {
                    "name": "Lasko",
                    "abbreviation": "057"
                },
                {
                    "name": "Lenart",
                    "abbreviation": "058"
                },
                {
                    "name": "Lendava",
                    "abbreviation": "059"
                },
                {
                    "name": "Litija",
                    "abbreviation": "060"
                },
                {
                    "name": "Ljubljana",
                    "abbreviation": "061"
                },
                {
                    "name": "Ljubno",
                    "abbreviation": "062"
                },
                {
                    "name": "Ljutomer",
                    "abbreviation": "063"
                },
                {
                    "name": "Logatec",
                    "abbreviation": "064"
                },
                {
                    "name": "Loska dolina",
                    "abbreviation": "065"
                },
                {
                    "name": "Loski Potok",
                    "abbreviation": "066"
                },
                {
                    "name": "Lovrenc na Pohorju",
                    "abbreviation": "167"
                },
                {
                    "name": "Luce",
                    "abbreviation": "067"
                },
                {
                    "name": "Lukovica",
                    "abbreviation": "068"
                },
                {
                    "name": "Majsperk",
                    "abbreviation": "069"
                },
                {
                    "name": "Maribor",
                    "abbreviation": "070"
                },
                {
                    "name": "Markovci",
                    "abbreviation": "168"
                },
                {
                    "name": "Medvode",
                    "abbreviation": "071"
                },
                {
                    "name": "Menges",
                    "abbreviation": "072"
                },
                {
                    "name": "Metlika",
                    "abbreviation": "073"
                },
                {
                    "name": "Mezica",
                    "abbreviation": "074"
                },
                {
                    "name": "Miklavz na Dravskern polju",
                    "abbreviation": "169"
                },
                {
                    "name": "Miren-Kostanjevica",
                    "abbreviation": "075"
                },
                {
                    "name": "Mirna Pec",
                    "abbreviation": "170"
                },
                {
                    "name": "Mislinja",
                    "abbreviation": "076"
                },
                {
                    "name": "Moravce",
                    "abbreviation": "077"
                },
                {
                    "name": "Moravske Toplice",
                    "abbreviation": "078"
                },
                {
                    "name": "Mozirje",
                    "abbreviation": "079"
                },
                {
                    "name": "Murska Sobota",
                    "abbreviation": "080"
                },
                {
                    "name": "Muta",
                    "abbreviation": "081"
                },
                {
                    "name": "Naklo",
                    "abbreviation": "082"
                },
                {
                    "name": "Nazarje",
                    "abbreviation": "083"
                },
                {
                    "name": "Nova Gorica",
                    "abbreviation": "084"
                },
                {
                    "name": "Nova mesto",
                    "abbreviation": "085"
                },
                {
                    "name": "Sveta Ana",
                    "abbreviation": "181"
                },
                {
                    "name": "Sveti Andraz v Slovenskih goricah",
                    "abbreviation": "182"
                },
                {
                    "name": "Sveti Jurij",
                    "abbreviation": "116"
                },
                {
                    "name": "Salovci",
                    "abbreviation": "033"
                },
                {
                    "name": "Sempeter-Vrtojba",
                    "abbreviation": "183"
                },
                {
                    "name": "Sencur",
                    "abbreviation": "117"
                },
                {
                    "name": "Sentilj",
                    "abbreviation": "118"
                },
                {
                    "name": "Sentjernej",
                    "abbreviation": "119"
                },
                {
                    "name": "Sentjur pri Celju",
                    "abbreviation": "120"
                },
                {
                    "name": "Skocjan",
                    "abbreviation": "121"
                },
                {
                    "name": "Skofja Loka",
                    "abbreviation": "122"
                },
                {
                    "name": "Skoftjica",
                    "abbreviation": "123"
                },
                {
                    "name": "Smarje pri Jelsah",
                    "abbreviation": "124"
                },
                {
                    "name": "Smartno ob Paki",
                    "abbreviation": "125"
                },
                {
                    "name": "Smartno pri Litiji",
                    "abbreviation": "194"
                },
                {
                    "name": "Sostanj",
                    "abbreviation": "126"
                },
                {
                    "name": "Store",
                    "abbreviation": "127"
                },
                {
                    "name": "Tabor",
                    "abbreviation": "184"
                },
                {
                    "name": "Tisina",
                    "abbreviation": "010"
                },
                {
                    "name": "Tolmin",
                    "abbreviation": "128"
                },
                {
                    "name": "Trbovje",
                    "abbreviation": "129"
                },
                {
                    "name": "Trebnje",
                    "abbreviation": "130"
                },
                {
                    "name": "Trnovska vas",
                    "abbreviation": "185"
                },
                {
                    "name": "Trzic",
                    "abbreviation": "131"
                },
                {
                    "name": "Trzin",
                    "abbreviation": "186"
                },
                {
                    "name": "Turnisce",
                    "abbreviation": "132"
                },
                {
                    "name": "Velenje",
                    "abbreviation": "133"
                },
                {
                    "name": "Velika Polana",
                    "abbreviation": "187"
                },
                {
                    "name": "Velika Lasce",
                    "abbreviation": "134"
                },
                {
                    "name": "Verzej",
                    "abbreviation": "188"
                },
                {
                    "name": "Videm",
                    "abbreviation": "135"
                },
                {
                    "name": "Vipava",
                    "abbreviation": "136"
                },
                {
                    "name": "Vitanje",
                    "abbreviation": "137"
                },
                {
                    "name": "Vojnik",
                    "abbreviation": "138"
                },
                {
                    "name": "Vransko",
                    "abbreviation": "189"
                },
                {
                    "name": "Vrhnika",
                    "abbreviation": "140"
                },
                {
                    "name": "Vuzenica",
                    "abbreviation": "141"
                },
                {
                    "name": "Zagorje ob Savi",
                    "abbreviation": "142"
                },
                {
                    "name": "Zavrc",
                    "abbreviation": "143"
                },
                {
                    "name": "Zrece",
                    "abbreviation": "144"
                },
                {
                    "name": "Zalec",
                    "abbreviation": "190"
                },
                {
                    "name": "Zelezniki",
                    "abbreviation": "146"
                },
                {
                    "name": "Zetale",
                    "abbreviation": "191"
                },
                {
                    "name": "Ziri",
                    "abbreviation": "147"
                },
                {
                    "name": "Zirovnica",
                    "abbreviation": "192"
                },
                {
                    "name": "Zuzemberk",
                    "abbreviation": "193"
                }
            ],
            "1194": [
                {
                    "name": "Capital Territory (Honiara)",
                    "abbreviation": "CT"
                },
                {
                    "name": "Guadalcanal",
                    "abbreviation": "GU"
                },
                {
                    "name": "Isabel",
                    "abbreviation": "IS"
                },
                {
                    "name": "Makira",
                    "abbreviation": "MK"
                },
                {
                    "name": "Malaita",
                    "abbreviation": "ML"
                },
                {
                    "name": "Temotu",
                    "abbreviation": "TE"
                }
            ],
            "1195": [
                {
                    "name": "Awdal",
                    "abbreviation": "AW"
                },
                {
                    "name": "Bakool",
                    "abbreviation": "BK"
                },
                {
                    "name": "Banaadir",
                    "abbreviation": "BN"
                },
                {
                    "name": "Bay",
                    "abbreviation": "BY"
                },
                {
                    "name": "Galguduud",
                    "abbreviation": "GA"
                },
                {
                    "name": "Gedo",
                    "abbreviation": "GE"
                },
                {
                    "name": "Hiirsan",
                    "abbreviation": "HI"
                },
                {
                    "name": "Jubbada Dhexe",
                    "abbreviation": "JD"
                },
                {
                    "name": "Jubbada Hoose",
                    "abbreviation": "JH"
                },
                {
                    "name": "Mudug",
                    "abbreviation": "MU"
                },
                {
                    "name": "Nugaal",
                    "abbreviation": "NU"
                },
                {
                    "name": "Saneag",
                    "abbreviation": "SA"
                },
                {
                    "name": "Shabeellaha Dhexe",
                    "abbreviation": "SD"
                },
                {
                    "name": "Shabeellaha Hoose",
                    "abbreviation": "SH"
                },
                {
                    "name": "Sool",
                    "abbreviation": "SO"
                },
                {
                    "name": "Togdheer",
                    "abbreviation": "TO"
                },
                {
                    "name": "Woqooyi Galbeed",
                    "abbreviation": "WO"
                }
            ],
            "1196": [
                {
                    "name": "Eastern Cape",
                    "abbreviation": "EC"
                },
                {
                    "name": "Free State",
                    "abbreviation": "FS"
                },
                {
                    "name": "Gauteng",
                    "abbreviation": "GT"
                },
                {
                    "name": "Kwazulu-Natal",
                    "abbreviation": "NL"
                },
                {
                    "name": "Mpumalanga",
                    "abbreviation": "MP"
                },
                {
                    "name": "Northern Cape",
                    "abbreviation": "NC"
                },
                {
                    "name": "Limpopo",
                    "abbreviation": "NP"
                },
                {
                    "name": "Western Cape",
                    "abbreviation": "WC"
                },
                {
                    "name": "North West",
                    "abbreviation": "NW"
                }
            ],
            "1198": [
                {
                    "name": "Álava",
                    "abbreviation": "VI"
                },
                {
                    "name": "Albacete",
                    "abbreviation": "AB"
                },
                {
                    "name": "Alicante",
                    "abbreviation": "A"
                },
                {
                    "name": "Almería",
                    "abbreviation": "AL"
                },
                {
                    "name": "Asturias",
                    "abbreviation": "O"
                },
                {
                    "name": "Ávila",
                    "abbreviation": "AV"
                },
                {
                    "name": "Badajoz",
                    "abbreviation": "BA"
                },
                {
                    "name": "Baleares",
                    "abbreviation": "PM"
                },
                {
                    "name": "Barcelona",
                    "abbreviation": "B"
                },
                {
                    "name": "Burgos",
                    "abbreviation": "BU"
                },
                {
                    "name": "Cáceres",
                    "abbreviation": "CC"
                },
                {
                    "name": "Cádiz",
                    "abbreviation": "CA"
                },
                {
                    "name": "Cantabria",
                    "abbreviation": "S"
                },
                {
                    "name": "Castellón",
                    "abbreviation": "CS"
                },
                {
                    "name": "Ciudad Real",
                    "abbreviation": "CR"
                },
                {
                    "name": "Cuenca",
                    "abbreviation": "CU"
                },
                {
                    "name": "Girona [Gerona]",
                    "abbreviation": "GE"
                },
                {
                    "name": "Granada",
                    "abbreviation": "GR"
                },
                {
                    "name": "Guadalajara",
                    "abbreviation": "GU"
                },
                {
                    "name": "Guipúzcoa",
                    "abbreviation": "SS"
                },
                {
                    "name": "Huelva",
                    "abbreviation": "H"
                },
                {
                    "name": "Huesca",
                    "abbreviation": "HU"
                },
                {
                    "name": "Jaén",
                    "abbreviation": "J"
                },
                {
                    "name": "La Coruña",
                    "abbreviation": "C"
                },
                {
                    "name": "La Rioja",
                    "abbreviation": "LO"
                },
                {
                    "name": "Las Palmas",
                    "abbreviation": "GC"
                },
                {
                    "name": "León",
                    "abbreviation": "LE"
                },
                {
                    "name": "Lleida [Lérida]",
                    "abbreviation": "L"
                },
                {
                    "name": "Lugo",
                    "abbreviation": "LU"
                },
                {
                    "name": "Madrid",
                    "abbreviation": "M"
                },
                {
                    "name": "Málaga",
                    "abbreviation": "MA"
                },
                {
                    "name": "Murcia",
                    "abbreviation": "MU"
                },
                {
                    "name": "Navarra",
                    "abbreviation": "NA"
                },
                {
                    "name": "Ourense",
                    "abbreviation": "OR"
                },
                {
                    "name": "Palencia",
                    "abbreviation": "P"
                },
                {
                    "name": "Pontevedra",
                    "abbreviation": "PO"
                },
                {
                    "name": "Salamanca",
                    "abbreviation": "SA"
                },
                {
                    "name": "Santa Cruz de Tenerife",
                    "abbreviation": "TF"
                },
                {
                    "name": "Segovia",
                    "abbreviation": "SG"
                },
                {
                    "name": "Sevilla",
                    "abbreviation": "SE"
                },
                {
                    "name": "Soria",
                    "abbreviation": "SO"
                },
                {
                    "name": "Tarragona",
                    "abbreviation": "T"
                },
                {
                    "name": "Teruel",
                    "abbreviation": "TE"
                },
                {
                    "name": "Valencia",
                    "abbreviation": "V"
                },
                {
                    "name": "Valladolid",
                    "abbreviation": "VA"
                },
                {
                    "name": "Vizcaya",
                    "abbreviation": "BI"
                },
                {
                    "name": "Zamora",
                    "abbreviation": "ZA"
                },
                {
                    "name": "Zaragoza",
                    "abbreviation": "Z"
                },
                {
                    "name": "Ceuta",
                    "abbreviation": "CE"
                },
                {
                    "name": "Melilla",
                    "abbreviation": "ML"
                }
            ],
            "1199": [
                {
                    "name": "Ampara",
                    "abbreviation": "52"
                },
                {
                    "name": "Anuradhapura",
                    "abbreviation": "71"
                },
                {
                    "name": "Badulla",
                    "abbreviation": "81"
                },
                {
                    "name": "Batticaloa",
                    "abbreviation": "51"
                },
                {
                    "name": "Colombo",
                    "abbreviation": "11"
                },
                {
                    "name": "Galle",
                    "abbreviation": "31"
                },
                {
                    "name": "Gampaha",
                    "abbreviation": "12"
                },
                {
                    "name": "Hambantota",
                    "abbreviation": "33"
                },
                {
                    "name": "Jaffna",
                    "abbreviation": "41"
                },
                {
                    "name": "Kalutara",
                    "abbreviation": "13"
                },
                {
                    "name": "Kandy",
                    "abbreviation": "21"
                },
                {
                    "name": "Kegalla",
                    "abbreviation": "92"
                },
                {
                    "name": "Kilinochchi",
                    "abbreviation": "42"
                },
                {
                    "name": "Kurunegala",
                    "abbreviation": "61"
                },
                {
                    "name": "Mannar",
                    "abbreviation": "43"
                },
                {
                    "name": "Matale",
                    "abbreviation": "22"
                },
                {
                    "name": "Matara",
                    "abbreviation": "32"
                },
                {
                    "name": "Monaragala",
                    "abbreviation": "82"
                },
                {
                    "name": "Mullaittivu",
                    "abbreviation": "45"
                },
                {
                    "name": "Nuwara Eliya",
                    "abbreviation": "23"
                },
                {
                    "name": "Polonnaruwa",
                    "abbreviation": "72"
                },
                {
                    "name": "Puttalum",
                    "abbreviation": "62"
                },
                {
                    "name": "Ratnapura",
                    "abbreviation": "91"
                },
                {
                    "name": "Trincomalee",
                    "abbreviation": "53"
                },
                {
                    "name": "VavunLya",
                    "abbreviation": "44"
                }
            ],
            "1200": [
                {
                    "name": "A'ali an Nil",
                    "abbreviation": "23"
                },
                {
                    "name": "Al Bah al Ahmar",
                    "abbreviation": "26"
                },
                {
                    "name": "Al Buhayrat",
                    "abbreviation": "18"
                },
                {
                    "name": "Al Jazirah",
                    "abbreviation": "07"
                },
                {
                    "name": "Al Khartum",
                    "abbreviation": "03"
                },
                {
                    "name": "Al Qadarif",
                    "abbreviation": "06"
                },
                {
                    "name": "Al Wahdah",
                    "abbreviation": "22"
                },
                {
                    "name": "An Nil",
                    "abbreviation": "04"
                },
                {
                    "name": "An Nil al Abyaq",
                    "abbreviation": "08"
                },
                {
                    "name": "An Nil al Azraq",
                    "abbreviation": "24"
                },
                {
                    "name": "Ash Shamallyah",
                    "abbreviation": "01"
                },
                {
                    "name": "Bahr al Jabal",
                    "abbreviation": "17"
                },
                {
                    "name": "Gharb al Istiwa'iyah",
                    "abbreviation": "16"
                },
                {
                    "name": "Gharb Ba~r al Ghazal",
                    "abbreviation": "14"
                },
                {
                    "name": "Gharb Darfur",
                    "abbreviation": "12"
                },
                {
                    "name": "Gharb Kurdufan",
                    "abbreviation": "10"
                },
                {
                    "name": "Janub Darfur",
                    "abbreviation": "11"
                },
                {
                    "name": "Janub Rurdufan",
                    "abbreviation": "13"
                },
                {
                    "name": "Jnqall",
                    "abbreviation": "20"
                },
                {
                    "name": "Kassala",
                    "abbreviation": "05"
                },
                {
                    "name": "Shamal Batr al Ghazal",
                    "abbreviation": "15"
                },
                {
                    "name": "Shamal Darfur",
                    "abbreviation": "02"
                },
                {
                    "name": "Shamal Kurdufan",
                    "abbreviation": "09"
                },
                {
                    "name": "Sharq al Istiwa'iyah",
                    "abbreviation": "19"
                },
                {
                    "name": "Sinnar",
                    "abbreviation": "25"
                },
                {
                    "name": "Warab",
                    "abbreviation": "21"
                }
            ],
            "1201": [
                {
                    "name": "Brokopondo",
                    "abbreviation": "BR"
                },
                {
                    "name": "Commewijne",
                    "abbreviation": "CM"
                },
                {
                    "name": "Coronie",
                    "abbreviation": "CR"
                },
                {
                    "name": "Marowijne",
                    "abbreviation": "MA"
                },
                {
                    "name": "Nickerie",
                    "abbreviation": "NI"
                },
                {
                    "name": "Paramaribo",
                    "abbreviation": "PM"
                },
                {
                    "name": "Saramacca",
                    "abbreviation": "SA"
                },
                {
                    "name": "Sipaliwini",
                    "abbreviation": "SI"
                },
                {
                    "name": "Wanica",
                    "abbreviation": "WA"
                }
            ],
            "1203": [
                {
                    "name": "Hhohho",
                    "abbreviation": "HH"
                },
                {
                    "name": "Lubombo",
                    "abbreviation": "LU"
                },
                {
                    "name": "Manzini",
                    "abbreviation": "MA"
                },
                {
                    "name": "Shiselweni",
                    "abbreviation": "SH"
                }
            ],
            "1204": [
                {
                    "name": "Blekinge lan",
                    "abbreviation": "K"
                },
                {
                    "name": "Dalarnas lan",
                    "abbreviation": "W"
                },
                {
                    "name": "Gotlands lan",
                    "abbreviation": "I"
                },
                {
                    "name": "Gavleborge lan",
                    "abbreviation": "X"
                },
                {
                    "name": "Hallands lan",
                    "abbreviation": "N"
                },
                {
                    "name": "Jamtlande lan",
                    "abbreviation": "Z"
                },
                {
                    "name": "Jonkopings lan",
                    "abbreviation": "F"
                },
                {
                    "name": "Kalmar lan",
                    "abbreviation": "H"
                },
                {
                    "name": "Kronoberge lan",
                    "abbreviation": "G"
                },
                {
                    "name": "Norrbottena lan",
                    "abbreviation": "BD"
                },
                {
                    "name": "Skane lan",
                    "abbreviation": "M"
                },
                {
                    "name": "Stockholms lan",
                    "abbreviation": "AB"
                },
                {
                    "name": "Sodermanlands lan",
                    "abbreviation": "D"
                },
                {
                    "name": "Uppsala lan",
                    "abbreviation": "C"
                },
                {
                    "name": "Varmlanda lan",
                    "abbreviation": "S"
                },
                {
                    "name": "Vasterbottens lan",
                    "abbreviation": "AC"
                },
                {
                    "name": "Vasternorrlands lan",
                    "abbreviation": "Y"
                },
                {
                    "name": "Vastmanlanda lan",
                    "abbreviation": "U"
                },
                {
                    "name": "Vastra Gotalands lan",
                    "abbreviation": "Q"
                },
                {
                    "name": "Orebro lan",
                    "abbreviation": "T"
                },
                {
                    "name": "Ostergotlands lan",
                    "abbreviation": "E"
                }
            ],
            "1205": [
                {
                    "name": "Aargau",
                    "abbreviation": "AG"
                },
                {
                    "name": "Appenzell Innerrhoden",
                    "abbreviation": "AI"
                },
                {
                    "name": "Appenzell Ausserrhoden",
                    "abbreviation": "AR"
                },
                {
                    "name": "Bern",
                    "abbreviation": "BE"
                },
                {
                    "name": "Basel-Landschaft",
                    "abbreviation": "BL"
                },
                {
                    "name": "Basel-Stadt",
                    "abbreviation": "BS"
                },
                {
                    "name": "Fribourg",
                    "abbreviation": "FR"
                },
                {
                    "name": "Geneva",
                    "abbreviation": "GE"
                },
                {
                    "name": "Glarus",
                    "abbreviation": "GL"
                },
                {
                    "name": "Graubunden",
                    "abbreviation": "GR"
                },
                {
                    "name": "Jura",
                    "abbreviation": "JU"
                },
                {
                    "name": "Luzern",
                    "abbreviation": "LU"
                },
                {
                    "name": "Neuchatel",
                    "abbreviation": "NE"
                },
                {
                    "name": "Nidwalden",
                    "abbreviation": "NW"
                },
                {
                    "name": "Obwalden",
                    "abbreviation": "OW"
                },
                {
                    "name": "Sankt Gallen",
                    "abbreviation": "SG"
                },
                {
                    "name": "Schaffhausen",
                    "abbreviation": "SH"
                },
                {
                    "name": "Solothurn",
                    "abbreviation": "SO"
                },
                {
                    "name": "Schwyz",
                    "abbreviation": "SZ"
                },
                {
                    "name": "Thurgau",
                    "abbreviation": "TG"
                },
                {
                    "name": "Ticino",
                    "abbreviation": "TI"
                },
                {
                    "name": "Uri",
                    "abbreviation": "UR"
                },
                {
                    "name": "Vaud",
                    "abbreviation": "VD"
                },
                {
                    "name": "Valais",
                    "abbreviation": "VS"
                },
                {
                    "name": "Zug",
                    "abbreviation": "ZG"
                },
                {
                    "name": "Zurich",
                    "abbreviation": "ZH"
                }
            ],
            "1206": [
                {
                    "name": "Al Hasakah",
                    "abbreviation": "HA"
                },
                {
                    "name": "Al Ladhiqiyah",
                    "abbreviation": "LA"
                },
                {
                    "name": "Al Qunaytirah",
                    "abbreviation": "QU"
                },
                {
                    "name": "Ar Raqqah",
                    "abbreviation": "RA"
                },
                {
                    "name": "As Suwayda'",
                    "abbreviation": "SU"
                },
                {
                    "name": "Dar'a",
                    "abbreviation": "DR"
                },
                {
                    "name": "Dayr az Zawr",
                    "abbreviation": "DY"
                },
                {
                    "name": "Dimashq",
                    "abbreviation": "DI"
                },
                {
                    "name": "Halab",
                    "abbreviation": "HL"
                },
                {
                    "name": "Hamah",
                    "abbreviation": "HM"
                },
                {
                    "name": "Jim'",
                    "abbreviation": "HI"
                },
                {
                    "name": "Idlib",
                    "abbreviation": "ID"
                },
                {
                    "name": "Rif Dimashq",
                    "abbreviation": "RD"
                },
                {
                    "name": "Tarts",
                    "abbreviation": "TA"
                }
            ],
            "1207": [
                {
                    "name": "Principe",
                    "abbreviation": "P"
                },
                {
                    "name": "Sao Tome",
                    "abbreviation": "S"
                }
            ],
            "1208": [
                {
                    "name": "Changhua",
                    "abbreviation": "CHA"
                },
                {
                    "name": "Chiayi",
                    "abbreviation": "CYQ"
                },
                {
                    "name": "Hsinchu",
                    "abbreviation": "HSQ"
                },
                {
                    "name": "Hualien",
                    "abbreviation": "HUA"
                },
                {
                    "name": "Ilan",
                    "abbreviation": "ILA"
                },
                {
                    "name": "Kaohsiung",
                    "abbreviation": "KHQ"
                },
                {
                    "name": "Miaoli",
                    "abbreviation": "MIA"
                },
                {
                    "name": "Nantou",
                    "abbreviation": "NAN"
                },
                {
                    "name": "Penghu",
                    "abbreviation": "PEN"
                },
                {
                    "name": "Pingtung",
                    "abbreviation": "PIF"
                },
                {
                    "name": "Taichung",
                    "abbreviation": "TXQ"
                },
                {
                    "name": "Tainan",
                    "abbreviation": "TNQ"
                },
                {
                    "name": "Taipei",
                    "abbreviation": "TPQ"
                },
                {
                    "name": "Taitung",
                    "abbreviation": "TTT"
                },
                {
                    "name": "Taoyuan",
                    "abbreviation": "TAO"
                },
                {
                    "name": "Yunlin",
                    "abbreviation": "YUN"
                },
                {
                    "name": "Keelung",
                    "abbreviation": "KEE"
                }
            ],
            "1209": [
                {
                    "name": "Sughd",
                    "abbreviation": "SU"
                },
                {
                    "name": "Khatlon",
                    "abbreviation": "KT"
                },
                {
                    "name": "Gorno-Badakhshan",
                    "abbreviation": "GB"
                }
            ],
            "1210": [
                {
                    "name": "Arusha",
                    "abbreviation": "01"
                },
                {
                    "name": "Dar-es-Salaam",
                    "abbreviation": "02"
                },
                {
                    "name": "Dodoma",
                    "abbreviation": "03"
                },
                {
                    "name": "Iringa",
                    "abbreviation": "04"
                },
                {
                    "name": "Kagera",
                    "abbreviation": "05"
                },
                {
                    "name": "Kaskazini Pemba",
                    "abbreviation": "06"
                },
                {
                    "name": "Kaskazini Unguja",
                    "abbreviation": "07"
                },
                {
                    "name": "Xigoma",
                    "abbreviation": "08"
                },
                {
                    "name": "Kilimanjaro",
                    "abbreviation": "09"
                },
                {
                    "name": "Rusini Pemba",
                    "abbreviation": "10"
                },
                {
                    "name": "Kusini Unguja",
                    "abbreviation": "11"
                },
                {
                    "name": "Lindi",
                    "abbreviation": "12"
                },
                {
                    "name": "Manyara",
                    "abbreviation": "26"
                },
                {
                    "name": "Mara",
                    "abbreviation": "13"
                },
                {
                    "name": "Mbeya",
                    "abbreviation": "14"
                },
                {
                    "name": "Mjini Magharibi",
                    "abbreviation": "15"
                },
                {
                    "name": "Morogoro",
                    "abbreviation": "16"
                },
                {
                    "name": "Mtwara",
                    "abbreviation": "17"
                },
                {
                    "name": "Pwani",
                    "abbreviation": "19"
                },
                {
                    "name": "Rukwa",
                    "abbreviation": "20"
                },
                {
                    "name": "Ruvuma",
                    "abbreviation": "21"
                },
                {
                    "name": "Shinyanga",
                    "abbreviation": "22"
                },
                {
                    "name": "Singida",
                    "abbreviation": "23"
                },
                {
                    "name": "Tabora",
                    "abbreviation": "24"
                },
                {
                    "name": "Tanga",
                    "abbreviation": "25"
                }
            ],
            "1211": [
                {
                    "name": "Krung Thep Maha Nakhon Bangkok",
                    "abbreviation": "10"
                },
                {
                    "name": "Phatthaya",
                    "abbreviation": "S"
                },
                {
                    "name": "Amnat Charoen",
                    "abbreviation": "37"
                },
                {
                    "name": "Ang Thong",
                    "abbreviation": "15"
                },
                {
                    "name": "Buri Ram",
                    "abbreviation": "31"
                },
                {
                    "name": "Chachoengsao",
                    "abbreviation": "24"
                },
                {
                    "name": "Chai Nat",
                    "abbreviation": "18"
                },
                {
                    "name": "Chaiyaphum",
                    "abbreviation": "36"
                },
                {
                    "name": "Chanthaburi",
                    "abbreviation": "22"
                },
                {
                    "name": "Chiang Mai",
                    "abbreviation": "50"
                },
                {
                    "name": "Chiang Rai",
                    "abbreviation": "57"
                },
                {
                    "name": "Chon Buri",
                    "abbreviation": "20"
                },
                {
                    "name": "Chumphon",
                    "abbreviation": "86"
                },
                {
                    "name": "Kalasin",
                    "abbreviation": "46"
                },
                {
                    "name": "Kamphasng Phet",
                    "abbreviation": "62"
                },
                {
                    "name": "Kanchanaburi",
                    "abbreviation": "71"
                },
                {
                    "name": "Khon Kaen",
                    "abbreviation": "40"
                },
                {
                    "name": "Krabi",
                    "abbreviation": "81"
                },
                {
                    "name": "Lampang",
                    "abbreviation": "52"
                },
                {
                    "name": "Lamphun",
                    "abbreviation": "51"
                },
                {
                    "name": "Loei",
                    "abbreviation": "42"
                },
                {
                    "name": "Lop Buri",
                    "abbreviation": "16"
                },
                {
                    "name": "Mae Hong Son",
                    "abbreviation": "58"
                },
                {
                    "name": "Maha Sarakham",
                    "abbreviation": "44"
                },
                {
                    "name": "Mukdahan",
                    "abbreviation": "49"
                },
                {
                    "name": "Nakhon Nayok",
                    "abbreviation": "26"
                },
                {
                    "name": "Nakhon Pathom",
                    "abbreviation": "73"
                },
                {
                    "name": "Nakhon Phanom",
                    "abbreviation": "48"
                },
                {
                    "name": "Nakhon Ratchasima",
                    "abbreviation": "30"
                },
                {
                    "name": "Nakhon Sawan",
                    "abbreviation": "60"
                },
                {
                    "name": "Nakhon Si Thammarat",
                    "abbreviation": "80"
                },
                {
                    "name": "Nan",
                    "abbreviation": "55"
                },
                {
                    "name": "Narathiwat",
                    "abbreviation": "96"
                },
                {
                    "name": "Nong Bua Lam Phu",
                    "abbreviation": "39"
                },
                {
                    "name": "Nong Khai",
                    "abbreviation": "43"
                },
                {
                    "name": "Nonthaburi",
                    "abbreviation": "12"
                },
                {
                    "name": "Pathum Thani",
                    "abbreviation": "13"
                },
                {
                    "name": "Pattani",
                    "abbreviation": "94"
                },
                {
                    "name": "Phangnga",
                    "abbreviation": "82"
                },
                {
                    "name": "Phatthalung",
                    "abbreviation": "93"
                },
                {
                    "name": "Phayao",
                    "abbreviation": "56"
                },
                {
                    "name": "Phetchabun",
                    "abbreviation": "67"
                },
                {
                    "name": "Phetchaburi",
                    "abbreviation": "76"
                },
                {
                    "name": "Phichit",
                    "abbreviation": "66"
                },
                {
                    "name": "Phitsanulok",
                    "abbreviation": "65"
                },
                {
                    "name": "Phrae",
                    "abbreviation": "54"
                },
                {
                    "name": "Phra Nakhon Si Ayutthaya",
                    "abbreviation": "14"
                },
                {
                    "name": "Phaket",
                    "abbreviation": "83"
                },
                {
                    "name": "Prachin Buri",
                    "abbreviation": "25"
                },
                {
                    "name": "Prachuap Khiri Khan",
                    "abbreviation": "77"
                },
                {
                    "name": "Ranong",
                    "abbreviation": "85"
                },
                {
                    "name": "Ratchaburi",
                    "abbreviation": "70"
                },
                {
                    "name": "Rayong",
                    "abbreviation": "21"
                },
                {
                    "name": "Roi Et",
                    "abbreviation": "45"
                },
                {
                    "name": "Sa Kaeo",
                    "abbreviation": "27"
                },
                {
                    "name": "Sakon Nakhon",
                    "abbreviation": "47"
                },
                {
                    "name": "Samut Prakan",
                    "abbreviation": "11"
                },
                {
                    "name": "Samut Sakhon",
                    "abbreviation": "74"
                },
                {
                    "name": "Samut Songkhram",
                    "abbreviation": "75"
                },
                {
                    "name": "Saraburi",
                    "abbreviation": "19"
                },
                {
                    "name": "Satun",
                    "abbreviation": "91"
                },
                {
                    "name": "Sing Buri",
                    "abbreviation": "17"
                },
                {
                    "name": "Si Sa Ket",
                    "abbreviation": "33"
                },
                {
                    "name": "Songkhla",
                    "abbreviation": "90"
                },
                {
                    "name": "Sukhothai",
                    "abbreviation": "64"
                },
                {
                    "name": "Suphan Buri",
                    "abbreviation": "72"
                },
                {
                    "name": "Surat Thani",
                    "abbreviation": "84"
                },
                {
                    "name": "Surin",
                    "abbreviation": "32"
                },
                {
                    "name": "Tak",
                    "abbreviation": "63"
                },
                {
                    "name": "Trang",
                    "abbreviation": "92"
                },
                {
                    "name": "Trat",
                    "abbreviation": "23"
                },
                {
                    "name": "Ubon Ratchathani",
                    "abbreviation": "34"
                },
                {
                    "name": "Udon Thani",
                    "abbreviation": "41"
                },
                {
                    "name": "Uthai Thani",
                    "abbreviation": "61"
                },
                {
                    "name": "Uttaradit",
                    "abbreviation": "53"
                },
                {
                    "name": "Yala",
                    "abbreviation": "95"
                },
                {
                    "name": "Yasothon",
                    "abbreviation": "35"
                }
            ],
            "1212": [
                {
                    "name": "Acklins and Crooked Islands",
                    "abbreviation": "AC"
                },
                {
                    "name": "Bimini",
                    "abbreviation": "BI"
                },
                {
                    "name": "Cat Island",
                    "abbreviation": "CI"
                },
                {
                    "name": "Exuma",
                    "abbreviation": "EX"
                },
                {
                    "name": "Freeport",
                    "abbreviation": "FP"
                },
                {
                    "name": "Fresh Creek",
                    "abbreviation": "FC"
                },
                {
                    "name": "Governor's Harbour",
                    "abbreviation": "GH"
                },
                {
                    "name": "Green Turtle Cay",
                    "abbreviation": "GT"
                },
                {
                    "name": "Harbour Island",
                    "abbreviation": "HI"
                },
                {
                    "name": "High Rock",
                    "abbreviation": "HR"
                },
                {
                    "name": "Inagua",
                    "abbreviation": "IN"
                },
                {
                    "name": "Kemps Bay",
                    "abbreviation": "KB"
                },
                {
                    "name": "Long Island",
                    "abbreviation": "LI"
                },
                {
                    "name": "Marsh Harbour",
                    "abbreviation": "MH"
                },
                {
                    "name": "Mayaguana",
                    "abbreviation": "MG"
                },
                {
                    "name": "New Providence",
                    "abbreviation": "NP"
                },
                {
                    "name": "Nicholls Town and Berry Islands",
                    "abbreviation": "NB"
                },
                {
                    "name": "Ragged Island",
                    "abbreviation": "RI"
                },
                {
                    "name": "Rock Sound",
                    "abbreviation": "RS"
                },
                {
                    "name": "Sandy Point",
                    "abbreviation": "SP"
                },
                {
                    "name": "San Salvador and Rum Cay",
                    "abbreviation": "SR"
                }
            ],
            "1213": [
                {
                    "name": "Banjul",
                    "abbreviation": "B"
                },
                {
                    "name": "Lower River",
                    "abbreviation": "L"
                },
                {
                    "name": "MacCarthy Island",
                    "abbreviation": "M"
                },
                {
                    "name": "North Bank",
                    "abbreviation": "N"
                },
                {
                    "name": "Upper River",
                    "abbreviation": "U"
                }
            ],
            "1214": [
                {
                    "name": "Kara",
                    "abbreviation": "K"
                },
                {
                    "name": "Maritime (Region)",
                    "abbreviation": "M"
                },
                {
                    "name": "Savannes",
                    "abbreviation": "S"
                }
            ],
            "1217": [
                {
                    "name": "Couva-Tabaquite-Talparo",
                    "abbreviation": "CTT"
                },
                {
                    "name": "Diego Martin",
                    "abbreviation": "DMN"
                },
                {
                    "name": "Eastern Tobago",
                    "abbreviation": "ETO"
                },
                {
                    "name": "Penal-Debe",
                    "abbreviation": "PED"
                },
                {
                    "name": "Princes Town",
                    "abbreviation": "PRT"
                },
                {
                    "name": "Rio Claro-Mayaro",
                    "abbreviation": "RCM"
                },
                {
                    "name": "Sangre Grande",
                    "abbreviation": "SGE"
                },
                {
                    "name": "San Juan-Laventille",
                    "abbreviation": "SJL"
                },
                {
                    "name": "Siparia",
                    "abbreviation": "SIP"
                },
                {
                    "name": "Tunapuna-Piarco",
                    "abbreviation": "TUP"
                },
                {
                    "name": "Western Tobago",
                    "abbreviation": "WTO"
                },
                {
                    "name": "Arima",
                    "abbreviation": "ARI"
                },
                {
                    "name": "Chaguanas",
                    "abbreviation": "CHA"
                },
                {
                    "name": "Point Fortin",
                    "abbreviation": "PTF"
                },
                {
                    "name": "Port of Spain",
                    "abbreviation": "POS"
                },
                {
                    "name": "San Fernando",
                    "abbreviation": "SFO"
                }
            ],
            "1218": [
                {
                    "name": "Béja",
                    "abbreviation": "31"
                },
                {
                    "name": "Ben Arous",
                    "abbreviation": "13"
                },
                {
                    "name": "Bizerte",
                    "abbreviation": "23"
                },
                {
                    "name": "Gabès",
                    "abbreviation": "81"
                },
                {
                    "name": "Gafsa",
                    "abbreviation": "71"
                },
                {
                    "name": "Jendouba",
                    "abbreviation": "32"
                },
                {
                    "name": "Kairouan",
                    "abbreviation": "41"
                },
                {
                    "name": "Rasserine",
                    "abbreviation": "42"
                },
                {
                    "name": "Kebili",
                    "abbreviation": "73"
                },
                {
                    "name": "L'Ariana",
                    "abbreviation": "12"
                },
                {
                    "name": "Le Ref",
                    "abbreviation": "33"
                },
                {
                    "name": "Mahdia",
                    "abbreviation": "53"
                },
                {
                    "name": "La Manouba",
                    "abbreviation": "14"
                },
                {
                    "name": "Medenine",
                    "abbreviation": "82"
                },
                {
                    "name": "Moneatir",
                    "abbreviation": "52"
                },
                {
                    "name": "Naboul",
                    "abbreviation": "21"
                },
                {
                    "name": "Sfax",
                    "abbreviation": "61"
                },
                {
                    "name": "Sidi Bouxid",
                    "abbreviation": "43"
                },
                {
                    "name": "Siliana",
                    "abbreviation": "34"
                },
                {
                    "name": "Sousse",
                    "abbreviation": "51"
                },
                {
                    "name": "Tataouine",
                    "abbreviation": "83"
                },
                {
                    "name": "Tozeur",
                    "abbreviation": "72"
                },
                {
                    "name": "Tunis",
                    "abbreviation": "11"
                },
                {
                    "name": "Zaghouan",
                    "abbreviation": "22"
                }
            ],
            "1219": [
                {
                    "name": "Adana",
                    "abbreviation": "01"
                },
                {
                    "name": "Ad yaman",
                    "abbreviation": "02"
                },
                {
                    "name": "Afyon",
                    "abbreviation": "03"
                },
                {
                    "name": "Ag r",
                    "abbreviation": "04"
                },
                {
                    "name": "Aksaray",
                    "abbreviation": "68"
                },
                {
                    "name": "Amasya",
                    "abbreviation": "05"
                },
                {
                    "name": "Ankara",
                    "abbreviation": "06"
                },
                {
                    "name": "Antalya",
                    "abbreviation": "07"
                },
                {
                    "name": "Ardahan",
                    "abbreviation": "75"
                },
                {
                    "name": "Artvin",
                    "abbreviation": "08"
                },
                {
                    "name": "Aydin",
                    "abbreviation": "09"
                },
                {
                    "name": "Bal kesir",
                    "abbreviation": "10"
                },
                {
                    "name": "Bartin",
                    "abbreviation": "74"
                },
                {
                    "name": "Batman",
                    "abbreviation": "72"
                },
                {
                    "name": "Bayburt",
                    "abbreviation": "69"
                },
                {
                    "name": "Bilecik",
                    "abbreviation": "11"
                },
                {
                    "name": "Bingol",
                    "abbreviation": "12"
                },
                {
                    "name": "Bitlis",
                    "abbreviation": "13"
                },
                {
                    "name": "Bolu",
                    "abbreviation": "14"
                },
                {
                    "name": "Burdur",
                    "abbreviation": "15"
                },
                {
                    "name": "Bursa",
                    "abbreviation": "16"
                },
                {
                    "name": "Canakkale",
                    "abbreviation": "17"
                },
                {
                    "name": "Cankir",
                    "abbreviation": "18"
                },
                {
                    "name": "Corum",
                    "abbreviation": "19"
                },
                {
                    "name": "Denizli",
                    "abbreviation": "20"
                },
                {
                    "name": "Diyarbakir",
                    "abbreviation": "21"
                },
                {
                    "name": "Duzce",
                    "abbreviation": "81"
                },
                {
                    "name": "Edirne",
                    "abbreviation": "22"
                },
                {
                    "name": "Elazig",
                    "abbreviation": "23"
                },
                {
                    "name": "Erzincan",
                    "abbreviation": "24"
                },
                {
                    "name": "Erzurum",
                    "abbreviation": "25"
                },
                {
                    "name": "Eskis'ehir",
                    "abbreviation": "26"
                },
                {
                    "name": "Gaziantep",
                    "abbreviation": "27"
                },
                {
                    "name": "Giresun",
                    "abbreviation": "28"
                },
                {
                    "name": "Gms'hane",
                    "abbreviation": "29"
                },
                {
                    "name": "Hakkari",
                    "abbreviation": "30"
                },
                {
                    "name": "Hatay",
                    "abbreviation": "31"
                },
                {
                    "name": "Igidir",
                    "abbreviation": "76"
                },
                {
                    "name": "Isparta",
                    "abbreviation": "32"
                },
                {
                    "name": "Icel",
                    "abbreviation": "33"
                },
                {
                    "name": "Istanbul",
                    "abbreviation": "34"
                },
                {
                    "name": "Izmir",
                    "abbreviation": "35"
                },
                {
                    "name": "Kahramanmaras",
                    "abbreviation": "46"
                },
                {
                    "name": "Karabk",
                    "abbreviation": "78"
                },
                {
                    "name": "Karaman",
                    "abbreviation": "70"
                },
                {
                    "name": "Kars",
                    "abbreviation": "36"
                },
                {
                    "name": "Kastamonu",
                    "abbreviation": "37"
                },
                {
                    "name": "Kayseri",
                    "abbreviation": "38"
                },
                {
                    "name": "Kirikkale",
                    "abbreviation": "71"
                },
                {
                    "name": "Kirklareli",
                    "abbreviation": "39"
                },
                {
                    "name": "Kirs'ehir",
                    "abbreviation": "40"
                },
                {
                    "name": "Kilis",
                    "abbreviation": "79"
                },
                {
                    "name": "Kocaeli",
                    "abbreviation": "41"
                },
                {
                    "name": "Konya",
                    "abbreviation": "42"
                },
                {
                    "name": "Ktahya",
                    "abbreviation": "43"
                },
                {
                    "name": "Malatya",
                    "abbreviation": "44"
                },
                {
                    "name": "Manisa",
                    "abbreviation": "45"
                },
                {
                    "name": "Mardin",
                    "abbreviation": "47"
                },
                {
                    "name": "Mugila",
                    "abbreviation": "48"
                },
                {
                    "name": "Mus",
                    "abbreviation": "49"
                },
                {
                    "name": "Nevs'ehir",
                    "abbreviation": "50"
                },
                {
                    "name": "Nigide",
                    "abbreviation": "51"
                },
                {
                    "name": "Ordu",
                    "abbreviation": "52"
                },
                {
                    "name": "Osmaniye",
                    "abbreviation": "80"
                },
                {
                    "name": "Rize",
                    "abbreviation": "53"
                },
                {
                    "name": "Sakarya",
                    "abbreviation": "54"
                },
                {
                    "name": "Samsun",
                    "abbreviation": "55"
                },
                {
                    "name": "Siirt",
                    "abbreviation": "56"
                },
                {
                    "name": "Sinop",
                    "abbreviation": "57"
                },
                {
                    "name": "Sivas",
                    "abbreviation": "58"
                },
                {
                    "name": "S'anliurfa",
                    "abbreviation": "63"
                },
                {
                    "name": "S'rnak",
                    "abbreviation": "73"
                },
                {
                    "name": "Tekirdag",
                    "abbreviation": "59"
                },
                {
                    "name": "Tokat",
                    "abbreviation": "60"
                },
                {
                    "name": "Trabzon",
                    "abbreviation": "61"
                },
                {
                    "name": "Tunceli",
                    "abbreviation": "62"
                },
                {
                    "name": "Us'ak",
                    "abbreviation": "64"
                },
                {
                    "name": "Van",
                    "abbreviation": "65"
                },
                {
                    "name": "Yalova",
                    "abbreviation": "77"
                },
                {
                    "name": "Yozgat",
                    "abbreviation": "66"
                },
                {
                    "name": "Zonguldak",
                    "abbreviation": "67"
                }
            ],
            "1220": [
                {
                    "name": "Ahal",
                    "abbreviation": "A"
                },
                {
                    "name": "Balkan",
                    "abbreviation": "B"
                },
                {
                    "name": "Dasoguz",
                    "abbreviation": "D"
                },
                {
                    "name": "Lebap",
                    "abbreviation": "L"
                },
                {
                    "name": "Mary",
                    "abbreviation": "M"
                }
            ],
            "1223": [
                {
                    "name": "Adjumani",
                    "abbreviation": "301"
                },
                {
                    "name": "Apac",
                    "abbreviation": "302"
                },
                {
                    "name": "Arua",
                    "abbreviation": "303"
                },
                {
                    "name": "Bugiri",
                    "abbreviation": "201"
                },
                {
                    "name": "Bundibugyo",
                    "abbreviation": "401"
                },
                {
                    "name": "Bushenyi",
                    "abbreviation": "402"
                },
                {
                    "name": "Busia",
                    "abbreviation": "202"
                },
                {
                    "name": "Gulu",
                    "abbreviation": "304"
                },
                {
                    "name": "Hoima",
                    "abbreviation": "403"
                },
                {
                    "name": "Iganga",
                    "abbreviation": "203"
                },
                {
                    "name": "Jinja",
                    "abbreviation": "204"
                },
                {
                    "name": "Kabale",
                    "abbreviation": "404"
                },
                {
                    "name": "Kabarole",
                    "abbreviation": "405"
                },
                {
                    "name": "Kaberamaido",
                    "abbreviation": "213"
                },
                {
                    "name": "Kalangala",
                    "abbreviation": "101"
                },
                {
                    "name": "Kampala",
                    "abbreviation": "102"
                },
                {
                    "name": "Kamuli",
                    "abbreviation": "205"
                },
                {
                    "name": "Kamwenge",
                    "abbreviation": "413"
                },
                {
                    "name": "Kanungu",
                    "abbreviation": "414"
                },
                {
                    "name": "Kapchorwa",
                    "abbreviation": "206"
                },
                {
                    "name": "Kasese",
                    "abbreviation": "406"
                },
                {
                    "name": "Katakwi",
                    "abbreviation": "207"
                },
                {
                    "name": "Kayunga",
                    "abbreviation": "112"
                },
                {
                    "name": "Kibaale",
                    "abbreviation": "407"
                },
                {
                    "name": "Kiboga",
                    "abbreviation": "103"
                },
                {
                    "name": "Kisoro",
                    "abbreviation": "408"
                },
                {
                    "name": "Kitgum",
                    "abbreviation": "305"
                },
                {
                    "name": "Kotido",
                    "abbreviation": "306"
                },
                {
                    "name": "Kumi",
                    "abbreviation": "208"
                },
                {
                    "name": "Kyenjojo",
                    "abbreviation": "415"
                },
                {
                    "name": "Lira",
                    "abbreviation": "307"
                },
                {
                    "name": "Luwero",
                    "abbreviation": "104"
                },
                {
                    "name": "Masaka",
                    "abbreviation": "105"
                },
                {
                    "name": "Masindi",
                    "abbreviation": "409"
                },
                {
                    "name": "Mayuge",
                    "abbreviation": "214"
                },
                {
                    "name": "Mbale",
                    "abbreviation": "209"
                },
                {
                    "name": "Mbarara",
                    "abbreviation": "410"
                },
                {
                    "name": "Moroto",
                    "abbreviation": "308"
                },
                {
                    "name": "Moyo",
                    "abbreviation": "309"
                },
                {
                    "name": "Mpigi",
                    "abbreviation": "106"
                },
                {
                    "name": "Mubende",
                    "abbreviation": "107"
                },
                {
                    "name": "Mukono",
                    "abbreviation": "108"
                },
                {
                    "name": "Nakapiripirit",
                    "abbreviation": "311"
                },
                {
                    "name": "Nakasongola",
                    "abbreviation": "109"
                },
                {
                    "name": "Nebbi",
                    "abbreviation": "310"
                },
                {
                    "name": "Ntungamo",
                    "abbreviation": "411"
                },
                {
                    "name": "Pader",
                    "abbreviation": "312"
                },
                {
                    "name": "Pallisa",
                    "abbreviation": "210"
                },
                {
                    "name": "Rakai",
                    "abbreviation": "110"
                },
                {
                    "name": "Rukungiri",
                    "abbreviation": "412"
                },
                {
                    "name": "Sembabule",
                    "abbreviation": "111"
                },
                {
                    "name": "Sironko",
                    "abbreviation": "215"
                },
                {
                    "name": "Soroti",
                    "abbreviation": "211"
                },
                {
                    "name": "Tororo",
                    "abbreviation": "212"
                },
                {
                    "name": "Wakiso",
                    "abbreviation": "113"
                },
                {
                    "name": "Yumbe",
                    "abbreviation": "313"
                }
            ],
            "1224": [
                {
                    "name": "Cherkas'ka Oblast'",
                    "abbreviation": "71"
                },
                {
                    "name": "Chernihivs'ka Oblast'",
                    "abbreviation": "74"
                },
                {
                    "name": "Chernivets'ka Oblast'",
                    "abbreviation": "77"
                },
                {
                    "name": "Dnipropetrovs'ka Oblast'",
                    "abbreviation": "12"
                },
                {
                    "name": "Donets'ka Oblast'",
                    "abbreviation": "14"
                },
                {
                    "name": "Ivano-Frankivs'ka Oblast'",
                    "abbreviation": "26"
                },
                {
                    "name": "Kharkivs'ka Oblast'",
                    "abbreviation": "63"
                },
                {
                    "name": "Khersons'ka Oblast'",
                    "abbreviation": "65"
                },
                {
                    "name": "Khmel'nyts'ka Oblast'",
                    "abbreviation": "68"
                },
                {
                    "name": "Kirovohrads'ka Oblast'",
                    "abbreviation": "35"
                },
                {
                    "name": "Kyivs'ka Oblast'",
                    "abbreviation": "32"
                },
                {
                    "name": "Luhans'ka Oblast'",
                    "abbreviation": "09"
                },
                {
                    "name": "L'vivs'ka Oblast'",
                    "abbreviation": "46"
                },
                {
                    "name": "Mykolaivs'ka Oblast'",
                    "abbreviation": "48"
                },
                {
                    "name": "Odes 'ka Oblast'",
                    "abbreviation": "51"
                },
                {
                    "name": "Poltavs'ka Oblast'",
                    "abbreviation": "53"
                },
                {
                    "name": "Rivnens'ka Oblast'",
                    "abbreviation": "56"
                },
                {
                    "name": "Sums 'ka Oblast'",
                    "abbreviation": "59"
                },
                {
                    "name": "Ternopil's'ka Oblast'",
                    "abbreviation": "61"
                },
                {
                    "name": "Vinnyts'ka Oblast'",
                    "abbreviation": "05"
                },
                {
                    "name": "Volyos'ka Oblast'",
                    "abbreviation": "07"
                },
                {
                    "name": "Zakarpats'ka Oblast'",
                    "abbreviation": "21"
                },
                {
                    "name": "Zaporiz'ka Oblast'",
                    "abbreviation": "23"
                },
                {
                    "name": "Zhytomyrs'ka Oblast'",
                    "abbreviation": "18"
                },
                {
                    "name": "Respublika Krym",
                    "abbreviation": "43"
                },
                {
                    "name": "Kyiv",
                    "abbreviation": "30"
                },
                {
                    "name": "Sevastopol",
                    "abbreviation": "40"
                }
            ],
            "1225": [
                {
                    "name": "Abu Zaby",
                    "abbreviation": "AZ"
                },
                {
                    "name": "'Ajman",
                    "abbreviation": "AJ"
                },
                {
                    "name": "Al Fujayrah",
                    "abbreviation": "FU"
                },
                {
                    "name": "Ash Shariqah",
                    "abbreviation": "SH"
                },
                {
                    "name": "Dubayy",
                    "abbreviation": "DU"
                },
                {
                    "name": "Ra's al Khaymah",
                    "abbreviation": "RK"
                },
                {
                    "name": "Umm al Qaywayn",
                    "abbreviation": "UQ"
                }
            ],
            "1226": [
                {
                    "name": "Aberdeen City",
                    "abbreviation": "ABE"
                },
                {
                    "name": "Aberdeenshire",
                    "abbreviation": "ABD"
                },
                {
                    "name": "Angus",
                    "abbreviation": "ANS"
                },
                {
                    "name": "Co Antrim",
                    "abbreviation": "ANT"
                },
                {
                    "name": "Argyll and Bute",
                    "abbreviation": "AGB"
                },
                {
                    "name": "Co Armagh",
                    "abbreviation": "ARM"
                },
                {
                    "name": "Bedfordshire",
                    "abbreviation": "BDF"
                },
                {
                    "name": "Gwent",
                    "abbreviation": "BGW"
                },
                {
                    "name": "Bristol, City of",
                    "abbreviation": "BST"
                },
                {
                    "name": "Buckinghamshire",
                    "abbreviation": "BKM"
                },
                {
                    "name": "Cambridgeshire",
                    "abbreviation": "CAM"
                },
                {
                    "name": "Cheshire",
                    "abbreviation": "CHS"
                },
                {
                    "name": "Clackmannanshire",
                    "abbreviation": "CLK"
                },
                {
                    "name": "Cornwall",
                    "abbreviation": "CON"
                },
                {
                    "name": "Cumbria",
                    "abbreviation": "CMA"
                },
                {
                    "name": "Derbyshire",
                    "abbreviation": "DBY"
                },
                {
                    "name": "Co Londonderry",
                    "abbreviation": "DRY"
                },
                {
                    "name": "Devon",
                    "abbreviation": "DEV"
                },
                {
                    "name": "Dorset",
                    "abbreviation": "DOR"
                },
                {
                    "name": "Co Down",
                    "abbreviation": "DOW"
                },
                {
                    "name": "Dumfries and Galloway",
                    "abbreviation": "DGY"
                },
                {
                    "name": "Dundee City",
                    "abbreviation": "DND"
                },
                {
                    "name": "County Durham",
                    "abbreviation": "DUR"
                },
                {
                    "name": "East Ayrshire",
                    "abbreviation": "EAY"
                },
                {
                    "name": "East Dunbartonshire",
                    "abbreviation": "EDU"
                },
                {
                    "name": "East Lothian",
                    "abbreviation": "ELN"
                },
                {
                    "name": "East Renfrewshire",
                    "abbreviation": "ERW"
                },
                {
                    "name": "East Riding of Yorkshire",
                    "abbreviation": "ERY"
                },
                {
                    "name": "East Sussex",
                    "abbreviation": "ESX"
                },
                {
                    "name": "Edinburgh, City of",
                    "abbreviation": "EDH"
                },
                {
                    "name": "Na h-Eileanan Siar",
                    "abbreviation": "ELS"
                },
                {
                    "name": "Essex",
                    "abbreviation": "ESS"
                },
                {
                    "name": "Falkirk",
                    "abbreviation": "FAL"
                },
                {
                    "name": "Co Fermanagh",
                    "abbreviation": "FER"
                },
                {
                    "name": "Fife",
                    "abbreviation": "FIF"
                },
                {
                    "name": "Glasgow City",
                    "abbreviation": "GLG"
                },
                {
                    "name": "Gloucestershire",
                    "abbreviation": "GLS"
                },
                {
                    "name": "Gwynedd",
                    "abbreviation": "GWN"
                },
                {
                    "name": "Hampshire",
                    "abbreviation": "HAM"
                },
                {
                    "name": "Herefordshire",
                    "abbreviation": "HEF"
                },
                {
                    "name": "Hertfordshire",
                    "abbreviation": "HRT"
                },
                {
                    "name": "Highland",
                    "abbreviation": "HED"
                },
                {
                    "name": "Inverclyde",
                    "abbreviation": "IVC"
                },
                {
                    "name": "Isle of Wight",
                    "abbreviation": "IOW"
                },
                {
                    "name": "Kent",
                    "abbreviation": "KEN"
                },
                {
                    "name": "Lancashire",
                    "abbreviation": "LAN"
                },
                {
                    "name": "Leicestershire",
                    "abbreviation": "LEC"
                },
                {
                    "name": "Midlothian",
                    "abbreviation": "MLN"
                },
                {
                    "name": "Moray",
                    "abbreviation": "MRY"
                },
                {
                    "name": "Norfolk",
                    "abbreviation": "NFK"
                },
                {
                    "name": "North Ayrshire",
                    "abbreviation": "NAY"
                },
                {
                    "name": "North Lanarkshire",
                    "abbreviation": "NLK"
                },
                {
                    "name": "North Yorkshire",
                    "abbreviation": "NYK"
                },
                {
                    "name": "Northamptonshire",
                    "abbreviation": "NTH"
                },
                {
                    "name": "Northumberland",
                    "abbreviation": "NBL"
                },
                {
                    "name": "Nottinghamshire",
                    "abbreviation": "NTT"
                },
                {
                    "name": "Oldham",
                    "abbreviation": "OLD"
                },
                {
                    "name": "Omagh",
                    "abbreviation": "OMH"
                },
                {
                    "name": "Orkney Islands",
                    "abbreviation": "ORR"
                },
                {
                    "name": "Oxfordshire",
                    "abbreviation": "OXF"
                },
                {
                    "name": "Perth and Kinross",
                    "abbreviation": "PKN"
                },
                {
                    "name": "Powys",
                    "abbreviation": "POW"
                },
                {
                    "name": "Renfrewshire",
                    "abbreviation": "RFW"
                },
                {
                    "name": "Rutland",
                    "abbreviation": "RUT"
                },
                {
                    "name": "Scottish Borders",
                    "abbreviation": "SCB"
                },
                {
                    "name": "Shetland Islands",
                    "abbreviation": "ZET"
                },
                {
                    "name": "Shropshire",
                    "abbreviation": "SHR"
                },
                {
                    "name": "Somerset",
                    "abbreviation": "SOM"
                },
                {
                    "name": "South Ayrshire",
                    "abbreviation": "SAY"
                },
                {
                    "name": "South Gloucestershire",
                    "abbreviation": "SGC"
                },
                {
                    "name": "South Lanarkshire",
                    "abbreviation": "SLK"
                },
                {
                    "name": "Staffordshire",
                    "abbreviation": "STS"
                },
                {
                    "name": "Stirling",
                    "abbreviation": "STG"
                },
                {
                    "name": "Suffolk",
                    "abbreviation": "SFK"
                },
                {
                    "name": "Surrey",
                    "abbreviation": "SRY"
                },
                {
                    "name": "Mid Glamorgan",
                    "abbreviation": "VGL"
                },
                {
                    "name": "Warwickshire",
                    "abbreviation": "WAR"
                },
                {
                    "name": "West Dunbartonshire",
                    "abbreviation": "WDU"
                },
                {
                    "name": "West Lothian",
                    "abbreviation": "WLN"
                },
                {
                    "name": "West Sussex",
                    "abbreviation": "WSX"
                },
                {
                    "name": "Wiltshire",
                    "abbreviation": "WIL"
                },
                {
                    "name": "Worcestershire",
                    "abbreviation": "WOR"
                },
                {
                    "name": "Tyne and Wear",
                    "abbreviation": "TWR"
                },
                {
                    "name": "Greater Manchester",
                    "abbreviation": "GTM"
                },
                {
                    "name": "Co Tyrone",
                    "abbreviation": "TYR"
                },
                {
                    "name": "West Yorkshire",
                    "abbreviation": "WYK"
                },
                {
                    "name": "South Yorkshire",
                    "abbreviation": "SYK"
                },
                {
                    "name": "Merseyside",
                    "abbreviation": "MSY"
                },
                {
                    "name": "Berkshire",
                    "abbreviation": "BRK"
                },
                {
                    "name": "West Midlands",
                    "abbreviation": "WMD"
                },
                {
                    "name": "West Glamorgan",
                    "abbreviation": "WGM"
                },
                {
                    "name": "Greater London",
                    "abbreviation": "LON"
                },
                {
                    "name": "Clwyd",
                    "abbreviation": "CWD"
                },
                {
                    "name": "Dyfed",
                    "abbreviation": "DFD"
                },
                {
                    "name": "South Glamorgan",
                    "abbreviation": "SGM"
                }
            ],
            "1227": [
                {
                    "name": "Baker Island",
                    "abbreviation": "81"
                },
                {
                    "name": "Howland Island",
                    "abbreviation": "84"
                },
                {
                    "name": "Jarvis Island",
                    "abbreviation": "86"
                },
                {
                    "name": "Johnston Atoll",
                    "abbreviation": "67"
                },
                {
                    "name": "Kingman Reef",
                    "abbreviation": "89"
                },
                {
                    "name": "Midway Islands",
                    "abbreviation": "71"
                },
                {
                    "name": "Navassa Island",
                    "abbreviation": "76"
                },
                {
                    "name": "Palmyra Atoll",
                    "abbreviation": "95"
                },
                {
                    "name": "Wake Ialand",
                    "abbreviation": "79"
                }
            ],
            "1228": [
                {
                    "name": "Alabama",
                    "abbreviation": "AL"
                },
                {
                    "name": "Alaska",
                    "abbreviation": "AK"
                },
                {
                    "name": "Arizona",
                    "abbreviation": "AZ"
                },
                {
                    "name": "Arkansas",
                    "abbreviation": "AR"
                },
                {
                    "name": "California",
                    "abbreviation": "CA"
                },
                {
                    "name": "Colorado",
                    "abbreviation": "CO"
                },
                {
                    "name": "Connecticut",
                    "abbreviation": "CT"
                },
                {
                    "name": "Delaware",
                    "abbreviation": "DE"
                },
                {
                    "name": "Florida",
                    "abbreviation": "FL"
                },
                {
                    "name": "Georgia",
                    "abbreviation": "GA"
                },
                {
                    "name": "Hawaii",
                    "abbreviation": "HI"
                },
                {
                    "name": "Idaho",
                    "abbreviation": "ID"
                },
                {
                    "name": "Illinois",
                    "abbreviation": "IL"
                },
                {
                    "name": "Indiana",
                    "abbreviation": "IN"
                },
                {
                    "name": "Iowa",
                    "abbreviation": "IA"
                },
                {
                    "name": "Kansas",
                    "abbreviation": "KS"
                },
                {
                    "name": "Kentucky",
                    "abbreviation": "KY"
                },
                {
                    "name": "Louisiana",
                    "abbreviation": "LA"
                },
                {
                    "name": "Maine",
                    "abbreviation": "ME"
                },
                {
                    "name": "Maryland",
                    "abbreviation": "MD"
                },
                {
                    "name": "Massachusetts",
                    "abbreviation": "MA"
                },
                {
                    "name": "Michigan",
                    "abbreviation": "MI"
                },
                {
                    "name": "Minnesota",
                    "abbreviation": "MN"
                },
                {
                    "name": "Mississippi",
                    "abbreviation": "MS"
                },
                {
                    "name": "Missouri",
                    "abbreviation": "MO"
                },
                {
                    "name": "Montana",
                    "abbreviation": "MT"
                },
                {
                    "name": "Nebraska",
                    "abbreviation": "NE"
                },
                {
                    "name": "Nevada",
                    "abbreviation": "NV"
                },
                {
                    "name": "New Hampshire",
                    "abbreviation": "NH"
                },
                {
                    "name": "New Jersey",
                    "abbreviation": "NJ"
                },
                {
                    "name": "New Mexico",
                    "abbreviation": "NM"
                },
                {
                    "name": "New York",
                    "abbreviation": "NY"
                },
                {
                    "name": "North Carolina",
                    "abbreviation": "NC"
                },
                {
                    "name": "North Dakota",
                    "abbreviation": "ND"
                },
                {
                    "name": "Ohio",
                    "abbreviation": "OH"
                },
                {
                    "name": "Oklahoma",
                    "abbreviation": "OK"
                },
                {
                    "name": "Oregon",
                    "abbreviation": "OR"
                },
                {
                    "name": "Pennsylvania",
                    "abbreviation": "PA"
                },
                {
                    "name": "Rhode Island",
                    "abbreviation": "RI"
                },
                {
                    "name": "South Carolina",
                    "abbreviation": "SC"
                },
                {
                    "name": "South Dakota",
                    "abbreviation": "SD"
                },
                {
                    "name": "Tennessee",
                    "abbreviation": "TN"
                },
                {
                    "name": "Texas",
                    "abbreviation": "TX"
                },
                {
                    "name": "Utah",
                    "abbreviation": "UT"
                },
                {
                    "name": "Vermont",
                    "abbreviation": "VT"
                },
                {
                    "name": "Virginia",
                    "abbreviation": "VA"
                },
                {
                    "name": "Washington",
                    "abbreviation": "WA"
                },
                {
                    "name": "West Virginia",
                    "abbreviation": "WV"
                },
                {
                    "name": "Wisconsin",
                    "abbreviation": "WI"
                },
                {
                    "name": "Wyoming",
                    "abbreviation": "WY"
                },
                {
                    "name": "District of Columbia",
                    "abbreviation": "DC"
                },
                {
                    "name": "American Samoa",
                    "abbreviation": "AS"
                },
                {
                    "name": "Guam",
                    "abbreviation": "GU"
                },
                {
                    "name": "Northern Mariana Islands",
                    "abbreviation": "MP"
                },
                {
                    "name": "Puerto Rico",
                    "abbreviation": "PR"
                },
                {
                    "name": "Virgin Islands",
                    "abbreviation": "VI"
                },
                {
                    "name": "United States Minor Outlying Islands",
                    "abbreviation": "UM"
                },
                {
                    "name": "Armed Forces Europe",
                    "abbreviation": "AE"
                },
                {
                    "name": "Armed Forces Americas",
                    "abbreviation": "AA"
                },
                {
                    "name": "Armed Forces Pacific",
                    "abbreviation": "AP"
                }
            ],
            "1229": [
                {
                    "name": "Artigsa",
                    "abbreviation": "AR"
                },
                {
                    "name": "Canelones",
                    "abbreviation": "CA"
                },
                {
                    "name": "Cerro Largo",
                    "abbreviation": "CL"
                },
                {
                    "name": "Colonia",
                    "abbreviation": "CO"
                },
                {
                    "name": "Durazno",
                    "abbreviation": "DU"
                },
                {
                    "name": "Flores",
                    "abbreviation": "FS"
                },
                {
                    "name": "Lavalleja",
                    "abbreviation": "LA"
                },
                {
                    "name": "Maldonado",
                    "abbreviation": "MA"
                },
                {
                    "name": "Montevideo",
                    "abbreviation": "MO"
                },
                {
                    "name": "Paysandu",
                    "abbreviation": "PA"
                },
                {
                    "name": "Rivera",
                    "abbreviation": "RV"
                },
                {
                    "name": "Rocha",
                    "abbreviation": "RO"
                },
                {
                    "name": "Salto",
                    "abbreviation": "SA"
                },
                {
                    "name": "Soriano",
                    "abbreviation": "SO"
                },
                {
                    "name": "Tacuarembo",
                    "abbreviation": "TA"
                },
                {
                    "name": "Treinta y Tres",
                    "abbreviation": "TT"
                }
            ],
            "1230": [
                {
                    "name": "Toshkent (city)",
                    "abbreviation": "TK"
                },
                {
                    "name": "Qoraqalpogiston Respublikasi",
                    "abbreviation": "QR"
                },
                {
                    "name": "Andijon",
                    "abbreviation": "AN"
                },
                {
                    "name": "Buxoro",
                    "abbreviation": "BU"
                },
                {
                    "name": "Farg'ona",
                    "abbreviation": "FA"
                },
                {
                    "name": "Jizzax",
                    "abbreviation": "JI"
                },
                {
                    "name": "Khorazm",
                    "abbreviation": "KH"
                },
                {
                    "name": "Namangan",
                    "abbreviation": "NG"
                },
                {
                    "name": "Navoiy",
                    "abbreviation": "NW"
                },
                {
                    "name": "Qashqadaryo",
                    "abbreviation": "QA"
                },
                {
                    "name": "Samarqand",
                    "abbreviation": "SA"
                },
                {
                    "name": "Sirdaryo",
                    "abbreviation": "SI"
                },
                {
                    "name": "Surxondaryo",
                    "abbreviation": "SU"
                },
                {
                    "name": "Toshkent",
                    "abbreviation": "TO"
                },
                {
                    "name": "Xorazm",
                    "abbreviation": "XO"
                }
            ],
            "1231": [
                {
                    "name": "Malampa",
                    "abbreviation": "MAP"
                },
                {
                    "name": "Penama",
                    "abbreviation": "PAM"
                },
                {
                    "name": "Sanma",
                    "abbreviation": "SAM"
                },
                {
                    "name": "Shefa",
                    "abbreviation": "SEE"
                },
                {
                    "name": "Tafea",
                    "abbreviation": "TAE"
                },
                {
                    "name": "Torba",
                    "abbreviation": "TOB"
                }
            ],
            "1232": [
                {
                    "name": "Diatrito Federal",
                    "abbreviation": "A"
                },
                {
                    "name": "Anzoategui",
                    "abbreviation": "B"
                },
                {
                    "name": "Apure",
                    "abbreviation": "C"
                },
                {
                    "name": "Aragua",
                    "abbreviation": "D"
                },
                {
                    "name": "Barinas",
                    "abbreviation": "E"
                },
                {
                    "name": "Carabobo",
                    "abbreviation": "G"
                },
                {
                    "name": "Cojedes",
                    "abbreviation": "H"
                },
                {
                    "name": "Falcon",
                    "abbreviation": "I"
                },
                {
                    "name": "Guarico",
                    "abbreviation": "J"
                },
                {
                    "name": "Lara",
                    "abbreviation": "K"
                },
                {
                    "name": "Merida",
                    "abbreviation": "L"
                },
                {
                    "name": "Miranda",
                    "abbreviation": "M"
                },
                {
                    "name": "Monagas",
                    "abbreviation": "N"
                },
                {
                    "name": "Nueva Esparta",
                    "abbreviation": "O"
                },
                {
                    "name": "Portuguesa",
                    "abbreviation": "P"
                },
                {
                    "name": "Tachira",
                    "abbreviation": "S"
                },
                {
                    "name": "Trujillo",
                    "abbreviation": "T"
                },
                {
                    "name": "Vargas",
                    "abbreviation": "X"
                },
                {
                    "name": "Yaracuy",
                    "abbreviation": "U"
                },
                {
                    "name": "Zulia",
                    "abbreviation": "V"
                },
                {
                    "name": "Delta Amacuro",
                    "abbreviation": "Y"
                },
                {
                    "name": "Dependencias Federales",
                    "abbreviation": "W"
                }
            ],
            "1233": [
                {
                    "name": "Dac Lac",
                    "abbreviation": "33"
                },
                {
                    "name": "An Giang",
                    "abbreviation": "44"
                },
                {
                    "name": "Ba Ria - Vung Tau",
                    "abbreviation": "43"
                },
                {
                    "name": "Bac Can",
                    "abbreviation": "53"
                },
                {
                    "name": "Bac Giang",
                    "abbreviation": "54"
                },
                {
                    "name": "Bac Lieu",
                    "abbreviation": "55"
                },
                {
                    "name": "Bac Ninh",
                    "abbreviation": "56"
                },
                {
                    "name": "Ben Tre",
                    "abbreviation": "50"
                },
                {
                    "name": "Binh Dinh",
                    "abbreviation": "31"
                },
                {
                    "name": "Binh Duong",
                    "abbreviation": "57"
                },
                {
                    "name": "Binh Phuoc",
                    "abbreviation": "58"
                },
                {
                    "name": "Binh Thuan",
                    "abbreviation": "40"
                },
                {
                    "name": "Ca Mau",
                    "abbreviation": "59"
                },
                {
                    "name": "Can Tho",
                    "abbreviation": "48"
                },
                {
                    "name": "Cao Bang",
                    "abbreviation": "04"
                },
                {
                    "name": "Da Nang, thanh pho",
                    "abbreviation": "60"
                },
                {
                    "name": "Dong Nai",
                    "abbreviation": "39"
                },
                {
                    "name": "Dong Thap",
                    "abbreviation": "45"
                },
                {
                    "name": "Gia Lai",
                    "abbreviation": "30"
                },
                {
                    "name": "Ha Giang",
                    "abbreviation": "03"
                },
                {
                    "name": "Ha Nam",
                    "abbreviation": "63"
                },
                {
                    "name": "Ha Noi, thu do",
                    "abbreviation": "64"
                },
                {
                    "name": "Ha Tay",
                    "abbreviation": "15"
                },
                {
                    "name": "Ha Tinh",
                    "abbreviation": "23"
                },
                {
                    "name": "Hai Duong",
                    "abbreviation": "61"
                },
                {
                    "name": "Hai Phong, thanh pho",
                    "abbreviation": "62"
                },
                {
                    "name": "Hoa Binh",
                    "abbreviation": "14"
                },
                {
                    "name": "Ho Chi Minh, thanh pho [Sai Gon]",
                    "abbreviation": "65"
                },
                {
                    "name": "Hung Yen",
                    "abbreviation": "66"
                },
                {
                    "name": "Khanh Hoa",
                    "abbreviation": "34"
                },
                {
                    "name": "Kien Giang",
                    "abbreviation": "47"
                },
                {
                    "name": "Kon Tum",
                    "abbreviation": "28"
                },
                {
                    "name": "Lai Chau",
                    "abbreviation": "01"
                },
                {
                    "name": "Lam Dong",
                    "abbreviation": "35"
                },
                {
                    "name": "Lang Son",
                    "abbreviation": "09"
                },
                {
                    "name": "Lao Cai",
                    "abbreviation": "02"
                },
                {
                    "name": "Long An",
                    "abbreviation": "41"
                },
                {
                    "name": "Nam Dinh",
                    "abbreviation": "67"
                },
                {
                    "name": "Nghe An",
                    "abbreviation": "22"
                },
                {
                    "name": "Ninh Binh",
                    "abbreviation": "18"
                },
                {
                    "name": "Ninh Thuan",
                    "abbreviation": "36"
                },
                {
                    "name": "Phu Tho",
                    "abbreviation": "68"
                },
                {
                    "name": "Phu Yen",
                    "abbreviation": "32"
                },
                {
                    "name": "Quang Binh",
                    "abbreviation": "24"
                },
                {
                    "name": "Quang Nam",
                    "abbreviation": "27"
                },
                {
                    "name": "Quang Ngai",
                    "abbreviation": "29"
                },
                {
                    "name": "Quang Ninh",
                    "abbreviation": "13"
                },
                {
                    "name": "Quang Tri",
                    "abbreviation": "25"
                },
                {
                    "name": "Soc Trang",
                    "abbreviation": "52"
                },
                {
                    "name": "Son La",
                    "abbreviation": "05"
                },
                {
                    "name": "Tay Ninh",
                    "abbreviation": "37"
                },
                {
                    "name": "Thai Binh",
                    "abbreviation": "20"
                },
                {
                    "name": "Thai Nguyen",
                    "abbreviation": "69"
                },
                {
                    "name": "Thanh Hoa",
                    "abbreviation": "21"
                },
                {
                    "name": "Thua Thien-Hue",
                    "abbreviation": "26"
                },
                {
                    "name": "Tien Giang",
                    "abbreviation": "46"
                },
                {
                    "name": "Tra Vinh",
                    "abbreviation": "51"
                },
                {
                    "name": "Tuyen Quang",
                    "abbreviation": "07"
                },
                {
                    "name": "Vinh Long",
                    "abbreviation": "49"
                },
                {
                    "name": "Vinh Phuc",
                    "abbreviation": "70"
                },
                {
                    "name": "Yen Bai",
                    "abbreviation": "06"
                }
            ],
            "1237": [
                {
                    "name": "Abyan",
                    "abbreviation": "AB"
                },
                {
                    "name": "Adan",
                    "abbreviation": "AD"
                },
                {
                    "name": "Ad Dali",
                    "abbreviation": "DA"
                },
                {
                    "name": "Al Bayda'",
                    "abbreviation": "BA"
                },
                {
                    "name": "Al Hudaydah",
                    "abbreviation": "MU"
                },
                {
                    "name": "Al Mahrah",
                    "abbreviation": "MR"
                },
                {
                    "name": "Al Mahwit",
                    "abbreviation": "MW"
                },
                {
                    "name": "Amran",
                    "abbreviation": "AM"
                },
                {
                    "name": "Dhamar",
                    "abbreviation": "DH"
                },
                {
                    "name": "Hadramawt",
                    "abbreviation": "HD"
                },
                {
                    "name": "Hajjah",
                    "abbreviation": "HJ"
                },
                {
                    "name": "Ibb",
                    "abbreviation": "IB"
                },
                {
                    "name": "Lahij",
                    "abbreviation": "LA"
                },
                {
                    "name": "Ma'rib",
                    "abbreviation": "MA"
                },
                {
                    "name": "Sa'dah",
                    "abbreviation": "SD"
                },
                {
                    "name": "San'a'",
                    "abbreviation": "SN"
                },
                {
                    "name": "Shabwah",
                    "abbreviation": "SH"
                },
                {
                    "name": "Ta'izz",
                    "abbreviation": "TA"
                }
            ],
            "1238": [
                {
                    "name": "Crna Gora",
                    "abbreviation": "CG"
                },
                {
                    "name": "Srbija",
                    "abbreviation": "SR"
                },
                {
                    "name": "Kosovo-Metohija",
                    "abbreviation": "KM"
                },
                {
                    "name": "Vojvodina",
                    "abbreviation": "VO"
                }
            ],
            "1239": [
                {
                    "name": "Copperbelt",
                    "abbreviation": "08"
                },
                {
                    "name": "Luapula",
                    "abbreviation": "04"
                },
                {
                    "name": "Lusaka",
                    "abbreviation": "09"
                },
                {
                    "name": "North-Western",
                    "abbreviation": "06"
                }
            ],
            "1240": [
                {
                    "name": "Bulawayo",
                    "abbreviation": "BU"
                },
                {
                    "name": "Harare",
                    "abbreviation": "HA"
                },
                {
                    "name": "Manicaland",
                    "abbreviation": "MA"
                },
                {
                    "name": "Mashonaland Central",
                    "abbreviation": "MC"
                },
                {
                    "name": "Mashonaland East",
                    "abbreviation": "ME"
                },
                {
                    "name": "Mashonaland West",
                    "abbreviation": "MW"
                },
                {
                    "name": "Masvingo",
                    "abbreviation": "MV"
                },
                {
                    "name": "Matabeleland North",
                    "abbreviation": "MN"
                },
                {
                    "name": "Matabeleland South",
                    "abbreviation": "MS"
                },
                {
                    "name": "Midlands",
                    "abbreviation": "MI"
                }
            ]
        }
    }
};