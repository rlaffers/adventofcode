// puzzle 20/2016
package main

import (
	"fmt"
	"math"
	"sort"
)

var debug bool = true
var test bool = false
var part2 = true

func main() {
	var input [][]uint32
	if test {
		input = [][]uint32{
			{5, 8},
			{0, 2},
			{4, 7},
		}
	} else {
		input = [][]uint32{
			{272152717, 281364173},
			{480675455, 489214207},
			{3562619188, 3566180938},
			{474796666, 476679929},
			{1859288016, 1859426304},
			{3500809029, 3520779986},
			{1711620671, 1724624325},
			{376497036, 379822744},
			{2334350029, 2336872286},
			{2880314906, 2881510051},
			{257912946, 260566708},
			{2964360275, 2973540924},
			{889696219, 900080622},
			{2727172832, 2737372242},
			{33674001, 51133436},
			{2718782366, 2736816045},
			{41293631, 52546854},
			{1064827080, 1071610531},
			{1373807967, 1374769067},
			{3261078460, 3268114587},
			{1583129312, 1602482863},
			{1605269651, 1617971405},
			{365345542, 377782493},
			{2858099254, 2862714857},
			{1147380159, 1156709753},
			{1087934555, 1093750979},
			{998603437, 1001868893},
			{234297440, 245049936},
			{427084952, 449321291},
			{3115490453, 3126172818},
			{0, 166475},
			{2859739533, 2864404117},
			{2879116214, 2888999956},
			{4166942312, 4169074982},
			{2693533587, 2694200673},
			{84162473, 84534337},
			{2164071501, 2168305216},
			{3745751095, 3750043362},
			{2647427848, 2647977897},
			{2028900925, 2034847596},
			{876886411, 878398110},
			{2589041333, 2589873869},
			{876959837, 878627172},
			{431139724, 458304869},
			{1877994382, 1887344924},
			{473575203, 475773145},
			{252091135, 257535969},
			{177110001, 177143710},
			{2722497928, 2723521816},
			{2208127, 2536514},
			{1748077674, 1751224226},
			{2362936907, 2381045647},
			{2020385448, 2029519771},
			{3108825744, 3123438032},
			{872292652, 885764819},
			{305053947, 314709696},
			{2717924562, 2718755692},
			{48149217, 51160833},
			{2149726170, 2150134226},
			{1729844094, 1745733187},
			{1375741284, 1378782323},
			{3744515388, 3761146958},
			{78523085, 78634151},
			{1634372345, 1650424418},
			{3199349237, 3209140394},
			{2011853949, 2039316392},
			{769580925, 794759455},
			{3841896290, 3862358298},
			{3360393034, 3379747723},
			{1120644472, 1134516526},
			{815948131, 837832345},
			{1590411139, 1596337230},
			{2894381219, 2935549329},
			{3688775236, 3725245783},
			{963257634, 966114246},
			{3566641344, 3578334024},
			{1402589368, 1434296916},
			{2742164387, 2746045182},
			{3336884060, 3357139723},
			{1529922302, 1532912060},
			{812048355, 820600359},
			{3535903629, 3546917858},
			{3793132304, 3794479774},
			{2441870431, 2446591046},
			{790688046, 795287265},
			{1094905232, 1100177740},
			{2745878705, 2749992348},
			{119256353, 127273572},
			{3046258846, 3057351205},
			{1754142948, 1755600336},
			{1439035504, 1441512409},
			{2099760008, 2108426979},
			{2336936249, 2337901885},
			{886155227, 897744302},
			{278389264, 304413122},
			{2261948686, 2274345666},
			{3650645303, 3661861270},
			{574462284, 588550773},
			{1759196520, 1782105094},
			{965026392, 968307163},
			{2946755906, 2963417308},
			{1766330775, 1797112785},
			{1200115116, 1225710522},
			{2080628180, 2093783866},
			{2259186780, 2265576012},
			{3422484974, 3431403368},
			{2617357126, 2619542029},
			{3535424340, 3544236729},
			{1159703397, 1178419333},
			{3695852451, 3731387995},
			{2624409231, 2626475102},
			{2462304649, 2486546066},
			{1991659530, 1991878310},
			{3675781139, 3676295005},
			{3077370804, 3098240471},
			{2410139047, 2412323245},
			{1441379095, 1464833739},
			{4254940654, 4257828865},
			{3134602505, 3135787446},
			{1531285367, 1533939508},
			{1982248547, 1989219645},
			{3717359312, 3718050739},
			{1149793223, 1159703395},
			{1718841131, 1723739366},
			{1338353885, 1363179561},
			{432322947, 450369838},
			{3592044590, 3598404106},
			{2783263665, 2802135338},
			{2743201911, 2758731127},
			{2940668500, 2946140977},
			{3588363275, 3594330069},
			{3675945049, 3679197388},
			{154488705, 187446525},
			{1653195306, 1670854086},
			{2771303647, 2772439896},
			{84146114, 84264353},
			{1593778990, 1622000763},
			{1580746474, 1580917737},
			{801556682, 801983712},
			{2268279290, 2282899033},
			{3429390560, 3432646573},
			{1355690206, 1364432183},
			{3364827834, 3370027309},
			{1343867080, 1356033542},
			{2769747098, 2802096717},
			{2451978746, 2499145061},
			{3181481071, 3202130015},
			{149287453, 193454621},
			{2907925124, 2933668261},
			{3525815495, 3531996642},
			{892781900, 902374081},
			{801983714, 808209514},
			{1205516416, 1207518863},
			{3475944050, 3479276890},
			{1680662691, 1693249318},
			{441188152, 451875207},
			{3866263742, 3869203885},
			{872306827, 886155226},
			{3641638239, 3656867109},
			{1292372277, 1314188693},
			{1062559245, 1064950825},
			{2334198700, 2335529918},
			{1122962410, 1136372412},
			{623323144, 625918342},
			{2425193847, 2429793856},
			{373315052, 379611660},
			{2418007458, 2424289401},
			{2149571480, 2150070836},
			{1991878311, 1994706041},
			{3043381174, 3046887777},
			{497434379, 500148281},
			{1825422529, 1838184381},
			{137450473, 139095016},
			{248808686, 249748629},
			{1989969134, 1990676913},
			{960553017, 960915199},
			{2336374612, 2337150925},
			{3369599561, 3390928276},
			{113852260, 145672651},
			{2986681144, 2989530365},
			{3856382204, 3873203604},
			{1657674792, 1663548211},
			{2650185850, 2651060935},
			{1647983099, 1662799191},
			{1082357088, 1112329267},
			{3793767754, 3794336046},
			{3705877748, 3728561957},
			{2769813898, 2772369413},
			{3794164058, 3801441915},
			{623200755, 625407322},
			{1241966895, 1253020214},
			{450369839, 463131291},
			{2717038617, 2723107862},
			{961267447, 962353699},
			{193454623, 196340979},
			{4253667440, 4261704870},
			{3269563154, 3275293388},
			{1505893371, 1506880655},
			{3873203606, 3889412741},
			{443548825, 444733658},
			{3045753812, 3049382630},
			{732764611, 733035245},
			{961034623, 961300670},
			{1373470559, 1373526698},
			{2860192109, 2867276065},
			{3312623058, 3313008029},
			{3942424007, 3951811891},
			{1197857710, 1214225356},
			{458105388, 462489469},
			{4259123154, 4263336824},
			{960863927, 961733781},
			{44819071, 52470556},
			{957158383, 958041099},
			{2543986743, 2554322396},
			{339721933, 346413740},
			{1010736956, 1030771663},
			{4288781458, 4289261456},
			{3687051286, 3722932714},
			{2420813443, 2424860115},
			{1989395087, 1989698527},
			{3473694511, 3476125935},
			{2408526816, 2412196386},
			{1989398215, 1991201331},
			{1526350090, 1542206580},
			{2394556084, 2399639414},
			{3510330656, 3522250181},
			{137874061, 144376880},
			{4167095310, 4177987517},
			{2785359721, 2785427263},
			{15024863, 23531388},
			{1625174667, 1658679299},
			{974122151, 995631685},
			{1540947566, 1554930456},
			{2424921025, 2429636819},
			{1993822183, 1994839237},
			{1094823818, 1097108689},
			{69796587, 71291314},
			{37126017, 49427721},
			{3793022166, 3794100162},
			{908189684, 911496714},
			{2911211968, 2917349047},
			{1227212686, 1234159311},
			{3776286544, 3783635666},
			{3531996644, 3536250992},
			{3396302214, 3406687062},
			{1476456536, 1478818018},
			{2443497737, 2447228620},
			{962292354, 965288690},
			{1833703443, 1843811212},
			{998277195, 1000562480},
			{883225973, 896212798},
			{2202815121, 2215802598},
			{3557733372, 3563107357},
			{2648035823, 2649474134},
			{2723831559, 2734044916},
			{1714279973, 1738575730},
			{110217, 574651},
			{1398965758, 1409470798},
			{2330603686, 2335139291},
			{1506286657, 1511280423},
			{3365567975, 3371386015},
			{466326205, 480223737},
			{1989219647, 1989438488},
			{3008188882, 3010347685},
			{1070925288, 1071665482},
			{2111554226, 2123836945},
			{2137226110, 2138852181},
			{1081261041, 1091870264},
			{1081552237, 1090538414},
			{2000657198, 2037677988},
			{2718009384, 2720142472},
			{925940762, 939052067},
			{4179143261, 4191765704},
			{3426378774, 3430410036},
			{3676393933, 3680167774},
			{3271833171, 3277125583},
			{274414401, 283893852},
			{3124560226, 3128380638},
			{1208163309, 1215074110},
			{2465798305, 2494706753},
			{3050317115, 3058897888},
			{1302678331, 1315210828},
			{1751224227, 1758206846},
			{931444766, 948598982},
			{151669773, 180559543},
			{255864690, 255985990},
			{1556987318, 1563743144},
			{16294070, 23923782},
			{1415762720, 1421421169},
			{3853344243, 3864268114},
			{1280237454, 1286328218},
			{2944350248, 2976813361},
			{2187770126, 2203436268},
			{3505239916, 3517301515},
			{3232015564, 3235367871},
			{2146211145, 2166090499},
			{910952647, 911877073},
			{1579658725, 1581392690},
			{1237242317, 1258610777},
			{2589766513, 2598433041},
			{3449310840, 3449858133},
			{745819525, 755688297},
			{3776094116, 3783478049},
			{2108426981, 2124149170},
			{3449389881, 3462604413},
			{2301503968, 2324628965},
			{1005263513, 1027181473},
			{1952664131, 1969650551},
			{1285113553, 1288652959},
			{3896408883, 3908694324},
			{1920600328, 1921999554},
			{1025403493, 1031247416},
			{3905769594, 3930128244},
			{1031247417, 1047578444},
			{3885007170, 3895219247},
			{3598377658, 3599404192},
			{1697890477, 1697912613},
			{954538505, 957768997},
			{2816494072, 2842728200},
			{492165035, 498202012},
			{3137181704, 3152588209},
			{1755735260, 1759196518},
			{1371495492, 1371550991},
			{2501923864, 2514064340},
			{305959083, 311818120},
			{4250019192, 4275532230},
			{114168261, 116414851},
			{2447228622, 2451978745},
			{766211517, 801556681},
			{3376445798, 3394303381},
			{3501155911, 3526104374},
			{2548986102, 2564634962},
			{3263667615, 3270390046},
			{1807095399, 1824137700},
			{856041972, 859823687},
			{3887315148, 3892355947},
			{1030764665, 1045428052},
			{638833662, 640333593},
			{2121184882, 2129744090},
			{2881011537, 2885878144},
			{3588560066, 3597713320},
			{3124980377, 3134500989},
			{489214209, 512240639},
			{3760702359, 3764383643},
			{1090166392, 1096894006},
			{917419134, 922706929},
			{1296067761, 1309424658},
			{689572986, 696039127},
			{2660085630, 2660431880},
			{680230992, 716886780},
			{1592087783, 1598197492},
			{1530767294, 1575862739},
			{2082087967, 2085220519},
			{2424541691, 2426736024},
			{113504564, 116385542},
			{1916132714, 1932780572},
			{503684477, 512284558},
			{2615977363, 2622859043},
			{4035141786, 4047227590},
			{1663548212, 1680662689},
			{3047614614, 3051657189},
			{2634680042, 2641014306},
			{2583260376, 2591896929},
			{2645275066, 2647436256},
			{64047546, 86026817},
			{1071039399, 1072162085},
			{2594771897, 2599508024},
			{83962861, 84534191},
			{902374083, 941216585},
			{2586806577, 2599448524},
			{1274245593, 1274516893},
			{4031038177, 4040911753},
			{983068813, 998624841},
			{534906133, 573925401},
			{3329216543, 3336884059},
			{4125892395, 4138236492},
			{3807924665, 3812644495},
			{1774911, 2450996},
			{446418646, 455236779},
			{2877486448, 2884177700},
			{1373832888, 1373901196},
			{370639181, 384962937},
			{12016954, 19316517},
			{3134500991, 3134627688},
			{1373501126, 1373590483},
			{1777703220, 1777741597},
			{3743473590, 3769013947},
			{2353521003, 2362936906},
			{2468617254, 2477279185},
			{78550601, 78698869},
			{1273031112, 1274488766},
			{968052409, 969178069},
			{3907082563, 3913084150},
			{3322437732, 3338709909},
			{970661335, 978617986},
			{2985507999, 2990149897},
			{1499815926, 1518480568},
			{2047086312, 2056763544},
			{3154050192, 3178489168},
			{1544927329, 1559460655},
			{614918489, 621719308},
			{3733606954, 3743473589},
			{1499734003, 1505336823},
			{1765493480, 1780907733},
			{1112329269, 1144192156},
			{1908189573, 1916132712},
			{2978158245, 2980295974},
			{854842773, 855564041},
			{3851762797, 3856667050},
			{2987912828, 2988480807},
			{3845355673, 3864117699},
			{2372563028, 2379155071},
			{4164107384, 4175248779},
			{206495443, 209268583},
			{2893360924, 2906330615},
			{1374122783, 1374244946},
			{1315210829, 1323332739},
			{2819221138, 2820241142},
			{2987725800, 2988399994},
			{3420480297, 3426061444},
			{1745733189, 1750260936},
			{2771579434, 2772910814},
			{1721651362, 1731098010},
			{1200223043, 1222602885},
			{3431337889, 3434193062},
			{2412323247, 2441870430},
			{3756861847, 3771488683},
			{853629069, 857835277},
			{3744664061, 3763198907},
			{1371491558, 1371529465},
			{1932780573, 1939156498},
			{3661861272, 3662675926},
			{2648267077, 2650619730},
			{3366486664, 3371903512},
			{1268371412, 1276470615},
			{2691106038, 2691272785},
			{3227264064, 3240740070},
			{1906133184, 1910990608},
			{3853470102, 3865286420},
			{2646285040, 2646358000},
			{2196926231, 2206264598},
			{4257710901, 4257836607},
			{242078367, 255972629},
			{4198987003, 4201086361},
			{1240990629, 1248211769},
			{2749992349, 2760767131},
			{2787866331, 2806708160},
			{809302575, 853629067},
			{3032053776, 3036049062},
			{2943717702, 2946230991},
			{4288724821, 4289568650},
			{3215397670, 3224618461},
			{1858955725, 1859353621},
			{2083864513, 2101037055},
			{694973182, 718973623},
			{4168983031, 4174451494},
			{2807055496, 2816494071},
			{1055347167, 1064190974},
			{3424907263, 3427071583},
			{859417782, 872292650},
			{1467661058, 1474811610},
			{2393002352, 2403005964},
			{4197417217, 4208856131},
			{3370246481, 3375696999},
			{1373468974, 1373569404},
			{2905152772, 2910933373},
			{1980855826, 1983920990},
			{732863279, 733152241},
			{4285742284, 4286129026},
			{1614476697, 1614835826},
			{2635427600, 2644232203},
			{1470741851, 1479153638},
			{2944130276, 2951908714},
			{4291064131, 4293894991},
			{1990921080, 1991701381},
			{4227850767, 4244632336},
			{1807565528, 1814396331},
			{2361860677, 2376637038},
			{2943119919, 2945768965},
			{2172859679, 2221926662},
			{249198701, 250135569},
			{2652844144, 2657371637},
			{1885639221, 1900413603},
			{1509729634, 1512261818},
			{3004310417, 3011080364},
			{1694482383, 1697891607},
			{4177987519, 4212820708},
			{4161048921, 4161074968},
			{476220543, 480675454},
			{2588894890, 2592105515},
			{2757311298, 2758434349},
			{4050934926, 4082396822},
			{2034604741, 2043305856},
			{2331464398, 2333528059},
			{1066956928, 1067355622},
			{2646313639, 2648035821},
			{2066636902, 2067863299},
			{2332503976, 2334659414},
			{3180110462, 3204410296},
			{577236362, 586064251},
			{256418607, 258764997},
			{2233705634, 2248146735},
			{3716569187, 3719939659},
			{1386717710, 1439035502},
			{1859175593, 1859580659},
			{3708021302, 3722129580},
			{3976120818, 4005662251},
			{304413124, 306709976},
			{1395309937, 1427985546},
			{4226665082, 4232713677},
			{4212820709, 4214429692},
			{1693249319, 1711620669},
			{2499145063, 2503398930},
			{3721989699, 3733606952},
			{1717757397, 1721218576},
			{1127769041, 1132781724},
			{3644972707, 3646872069},
			{2077152015, 2084609524},
			{1990599678, 1991511335},
			{2335139292, 2353521001},
			{4088569210, 4091483373},
			{1642017342, 1657864055},
			{2588719725, 2589121881},
			{2903005844, 2913683635},
			{194715771, 196440167},
			{3963719430, 3974518407},
			{4288320832, 4289172749},
			{3151726457, 3165427383},
			{23507982, 23800784},
			{2895160172, 2940456225},
			{1001177233, 1005263511},
			{43609109, 48863103},
			{1144192157, 1157514424},
			{734439882, 765944362},
			{695965351, 719454865},
			{856803507, 869754401},
			{1890217805, 1904089509},
			{3300131715, 3305283163},
			{1529237006, 1529595328},
			{2753090359, 2757523819},
			{828668586, 831203389},
			{3427619213, 3428732628},
			{2967859507, 2976560941},
			{2329569453, 2332265395},
			{2239885549, 2252296728},
			{1293808207, 1320485733},
			{2604175022, 2624108715},
			{2697882453, 2723829703},
			{2463205201, 2470677980},
			{3888353469, 3890883045},
			{400102191, 427084950},
			{4150245199, 4164107383},
			{1395492363, 1406000929},
			{3675122217, 3676808853},
			{116414852, 148746047},
			{787563761, 789069064},
			{3197100188, 3202418404},
			{1373782716, 1373895006},
			{2617111647, 2617819575},
			{2550216289, 2557881293},
			{1851804917, 1852370216},
			{2617793199, 2618721355},
			{1939113565, 1942772474},
			{1066259539, 1066964651},
			{2536515, 2749485},
			{3851513911, 3872830251},
			{3315330215, 3350319238},
			{1372313956, 1373952939},
			{270099979, 278389263},
			{2861061889, 2874958905},
			{2982764434, 2982918860},
			{1225710523, 1232594859},
			{3080849793, 3087237669},
			{2168507276, 2172859677},
			{2554045929, 2558669015},
			{2715737041, 2742164385},
			{2564405335, 2570912208},
			{3111405671, 3131810967},
			{1881537985, 1906133183},
			{2327518639, 2329278606},
			{1695964017, 1700687554},
			{2325334299, 2328665915},
			{2329084251, 2329569451},
			{2526389631, 2574332443},
			{2716903062, 2718451591},
			{177141073, 177775415},
			{177103338, 177124151},
			{1072162087, 1081552236},
			{3178535948, 3199349236},
			{2293206667, 2314675667},
			{1889288474, 1903754822},
			{4251848410, 4278329656},
			{697896245, 706915923},
			{1811201479, 1827334058},
			{102113146, 112076690},
			{2390223078, 2399260655},
			{829332527, 848880205},
			{3861878449, 3866482364},
			{1213011864, 1220748067},
			{3580711167, 3587101215},
			{1286680169, 1311818230},
			{3608853495, 3610981230},
			{1511277091, 1513257838},
			{3450147668, 3459285977},
			{2780989504, 2803855679},
			{3882846313, 3888163900},
			{941216586, 953952178},
			{2983401144, 2988059936},
			{2624108716, 2624926759},
			{3402309579, 3420480295},
			{3312749262, 3314042171},
			{3399699391, 3418732708},
			{4105670961, 4129433645},
			{4257493527, 4284962279},
			{23923784, 47709067},
			{953952180, 957049748},
			{2876724088, 2878697891},
			{2416003985, 2423463911},
			{740946393, 742024905},
			{1380318986, 1386717709},
			{2026496387, 2041982393},
			{3072950856, 3095969673},
			{196440168, 234297438},
			{3324520138, 3350841770},
			{1184551931, 1197857708},
			{3723507322, 3732029196},
			{1781641387, 1785877866},
			{2407131596, 2409544298},
			{5689429, 5741644},
			{1739110416, 1741141505},
			{2548794765, 2558310137},
			{808209515, 836691306},
			{2657455751, 2663837619},
			{790539346, 793059170},
			{568516293, 569131984},
			{3321930331, 3346790026},
			{472011317, 479941460},
			{857857646, 863011064},
			{4168502125, 4170164107},
			{588550774, 597747807},
			{1637815642, 1662350209},
			{2460793334, 2466026338},
			{958041100, 970661333},
			{2139217624, 2146211143},
			{2539598, 2830629},
			{1266192646, 1268371411},
			{1323332741, 1335959162},
			{1439736912, 1446610546},
			{4061001198, 4065392221},
			{2524105557, 2526389630},
			{2222452808, 2225462596},
			{1388815777, 1397555491},
			{3612936376, 3650645302},
			{3045926276, 3065706826},
			{3574212945, 3575594696},
			{2827277916, 2836024368},
			{1991475869, 1991926125},
			{3505806023, 3528702608},
			{2414724634, 2430851599},
			{3021588078, 3028285988},
			{2574332445, 2592271496},
			{2057264136, 2059202053},
			{3244432520, 3248685694},
			{1712738962, 1729844093},
			{56528833, 64047545},
			{2971719660, 2977620581},
			{3605787690, 3611524810},
			{3851574035, 3854062441},
			{1235784822, 1266192644},
			{3006793176, 3021032700},
			{3900016789, 3922138525},
			{1234159313, 1235784821},
			{455883118, 466326203},
			{1053312381, 1063953379},
			{2820222101, 2821175967},
			{2502044549, 2506260381},
			{568736374, 569251939},
			{1578664897, 1579658724},
			{344106424, 350103368},
			{1590175536, 1595299212},
			{2273779785, 2277363906},
			{3984562197, 4010152611},
			{45721618, 54860968},
			{3394303383, 3402309578},
			{1511624839, 1512608254},
			{3884829071, 3890292172},
			{2038966626, 2047086310},
			{4103290900, 4119641469},
			{3357139725, 3360393033},
			{2780813493, 2807055494},
			{2225462598, 2252329658},
			{2592271497, 2604175020},
			{1049541136, 1055392314},
			{1533973152, 1578664895},
			{3209140396, 3244432519},
			{3135787447, 3178535946},
			{1873694527, 1911946735},
			{3716488307, 3717917511},
			{1863079077, 1868159650},
			{1852620713, 1869463034},
			{2340761, 6722844},
			{4010806326, 4011637774},
			{2335714002, 2344955062},
			{2503398931, 2516105578},
			{4096488349, 4097750835},
			{495702052, 499886980},
			{2633949022, 2643879390},
			{2230563996, 2248676097},
			{1992368509, 1995459736},
			{725466259, 734439880},
			{3284564906, 3289305182},
			{3006621951, 3015555807},
			{2221926663, 2224742001},
			{1807424325, 1816026389},
			{1876686839, 1880758503},
			{2691158517, 2691387740},
			{3757816372, 3758051212},
			{2956964132, 2972741344},
			{2636000153, 2638744402},
			{678819639, 679798433},
			{250063049, 250516719},
			{3855876124, 3866454360},
			{3312438883, 3313193146},
			{82686086, 84339480},
			{1092916631, 1107918456},
			{1843811214, 1852620712},
			{3809172487, 3830073502},
			{2616993454, 2620553751},
			{2682855477, 2715737040},
			{3863648987, 3866503080},
			{1271724277, 1275741880},
			{2384026814, 2393286163},
			{2957501262, 2965749150},
			{4213745292, 4214551645},
			{2556715457, 2565699508},
			{2263615, 2555032},
			{2510926180, 2524105555},
			{2198333368, 2201790504},
			{983311745, 991202543},
			{326387197, 344106423},
			{3087807140, 3088895982},
			{86026819, 109305037},
			{2504533668, 2507452669},
			{1371550992, 1377668791},
			{1656901715, 1676675657},
			{130445224, 140364961},
			{875328099, 885585914},
			{2299489843, 2306253705},
			{3450835271, 3481339653},
			{4014358521, 4031038176},
			{2340311395, 2351064022},
			{2883149064, 2887845481},
			{2259592077, 2278614136},
			{3810542228, 3827200634},
			{3056035363, 3068664010},
			{722584522, 723699159},
			{1735688023, 1740818227},
			{3537763412, 3542953759},
			{2366293314, 2375211143},
			{1411814377, 1424672790},
			{3100999210, 3102484531},
			{4284962281, 4294967295},
			{1446610547, 1465468961},
			{2874958907, 2877486447},
			{1765556195, 1793446949},
			{4218980804, 4226442852},
			{494048500, 497170493},
			{360027343, 374159699},
			{2651399811, 2665409613},
			{1047578446, 1052368079},
			{2362920294, 2374232484},
			{2570748019, 2571266639},
			{3256410480, 3277105765},
			{3771488685, 3794388011},
			{722551086, 722999678},
			{741060508, 762846249},
			{1479919768, 1481248209},
			{614971153, 617471673},
			{2982621961, 2982812184},
			{2087732105, 2106406062},
			{2302394373, 2326071906},
			{886110869, 893987869},
			{864175670, 867272025},
			{2119076394, 2126808897},
			{1051546928, 1062419089},
			{678814708, 679604844},
			{2168305217, 2172141567},
			{2943803911, 2945854166},
			{321232218, 329790306},
			{391378250, 412099930},
			{539629846, 568721146},
			{3794388012, 3806424827},
			{2894304683, 2915255653},
			{856495621, 857857645},
			{2743551156, 2751996369},
			{1024955451, 1026100964},
			{177078688, 177123406},
			{4018256524, 4039886263},
			{3945209398, 3956309725},
			{2364930647, 2378530823},
			{1006976522, 1021887240},
			{3757741995, 3757947507},
			{1421470109, 1432888460},
			{3160832331, 3169658872},
			{177045468, 177087638},
			{1090463009, 1104430857},
			{1274373481, 1274578120},
			{2626475104, 2640453818},
			{3284290551, 3288427229},
			{1981618690, 1984277097},
			{1186456381, 1195032668},
			{5052363, 7502553},
			{1509795877, 1512150519},
			{3579924616, 3582548171},
			{4121363479, 4137513284},
			{1488580398, 1503472581},
			{2423275742, 2439608584},
			{2138662322, 2138915998},
			{1382223606, 1410305514},
			{3832391075, 3853706505},
			{1614422103, 1614651523},
			{3369142704, 3373032779},
			{719454867, 725466258},
			{2084732810, 2095200322},
			{1442897307, 1457439380},
			{2112887248, 2129529980},
			{4023595164, 4025287662},
			{611715160, 617013605},
			{778751841, 791194910},
			{3293566719, 3305859750},
			{1772772441, 1797304174},
			{1589764874, 1592539287},
			{1373791581, 1374176540},
			{1590792815, 1594025491},
			{1981551967, 1982435626},
			{1520347646, 1542585100},
			{3099494317, 3115490452},
			{3098240473, 3103804691},
			{3264851832, 3269554326},
			{766110784, 766211515},
			{2019539430, 2044044979},
			{3266317108, 3273234008},
			{1274283817, 1274437178},
			{2650371073, 2672921107},
			{2672921108, 2679629874},
			{2673449969, 2682855475},
			{765944363, 766205817},
			{3853706506, 3859959741},
			{1508362252, 1513253382},
			{876916046, 879636492},
			{3809955806, 3810745183},
			{1274121584, 1274542630},
			{3157351170, 3166046719},
			{1053524276, 1064827079},
			{3791652757, 3800601148},
			{2842728202, 2853639142},
			{3571512615, 3579166854},
			{679353613, 679923926},
			{3809191752, 3810740480},
			{2817388396, 2819591739},
			{2852317315, 2861061888},
			{4256942395, 4260208971},
			{3501898903, 3512880687},
			{3882475326, 3886137014},
			{1966578885, 1968167855},
			{410700018, 415718837},
			{3806424829, 3821851233},
			{1518480570, 1533973151},
			{3147464447, 3158958125},
			{197786374, 207567591},
			{3535028299, 3539195436},
			{4184714120, 4186894005},
			{448892515, 456388417},
			{671686622, 678352726},
			{1360272787, 1363580702},
			{2164873145, 2165892440},
			{3361616306, 3375689123},
			{3091164847, 3093370647},
			{3297273994, 3311056250},
			{398273343, 404652855},
			{1782105095, 1803766701},
			{1484145894, 1503189992},
			{2160023298, 2160172849},
			{2919583395, 2932229908},
			{2812705686, 2830443941},
			{2855216236, 2865262494},
			{148746049, 149287452},
			{589888575, 595456264},
			{314410823, 316970816},
			{2060986022, 2063938184},
			{1803766703, 1825422528},
			{2128237894, 2139217623},
			{4248957737, 4257018408},
			{3561933398, 3574109426},
			{1614389854, 1614749576},
			{468854062, 476024564},
			{436179755, 463764255},
			{589811734, 589875676},
			{673967863, 678814706},
			{979844884, 993353080},
			{1945908845, 1980551520},
			{1990017551, 1992668548},
			{1252508632, 1256783095},
			{2946230992, 2982621959},
			{3954810178, 3972017471},
			{3396778325, 3399315311},
			{3331661742, 3344656790},
			{3072306192, 3077370803},
			{4093061872, 4094625093},
			{2876543933, 2878230248},
			{2854310965, 2859128779},
			{4193316980, 4200095285},
			{730205666, 732782756},
			{3676211467, 3676732582},
			{666890880, 674578243},
			{1371568734, 1380318984},
			{4184744194, 4187112660},
			{1481248211, 1499734002},
			{3379867668, 3385527932},
			{1622428665, 1625174665},
			{3671900758, 3678171048},
			{3705951043, 3716692751},
			{1465468963, 1479919767},
			{1580610051, 1583129310},
			{350103370, 365345541},
			{3900102077, 3919890024},
			{2940456227, 2945966226},
			{3248685696, 3284290550},
			{544295457, 564157394},
			{4016705659, 4021147057},
			{791731732, 797225629},
			{1165689597, 1184551930},
			{3289305184, 3312438882},
			{4097750837, 4102130426},
			{4055841302, 4077041304},
			{3441155355, 3450835270},
			{3314042173, 3333554945},
			{597747809, 623200754},
			{356234097, 366220597},
			{2381045649, 2408455595},
			{4047227592, 4049208360},
			{4092327831, 4093008849},
			{3986217544, 4010716485},
			{3587101217, 3589409982},
			{3939796675, 3976120816},
			{1335959163, 1365648715},
			{3809562980, 3810806981},
			{1374160507, 1375189297},
			{1229723962, 1229853859},
			{2978027850, 2978555872},
			{1081232290, 1096685438},
			{3431403369, 3441155353},
			{3058481098, 3072306190},
			{3615995822, 3647806423},
			{626772256, 671686621},
			{1922970278, 1932303880},
			{687812741, 696977728},
			{3664395391, 3676520369},
			{2073554869, 2099760007},
			{512240640, 534906131},
			{47709068, 56528831},
			{255985991, 270099977},
			{3481339655, 3501155910},
			{2238475796, 2249793376},
			{3866035083, 3867269474},
			{4093117795, 4094756619},
			{4285929403, 4287400825},
			{702714634, 707275982},
			{3036049064, 3058481097},
			{1027080396, 1032733050},
			{113815262, 115324511},
			{2256577067, 2275122653},
			{1990217023, 1991256560},
			{109305038, 113504562},
			{978617987, 1000518126},
			{4057509129, 4071389442},
			{3739975721, 3747173973},
			{320182613, 320260227},
			{1770166, 1994691},
			{291087466, 296873313},
			{4086243810, 4096488348},
			{1276470617, 1302918078},
			{4009439486, 4012738003},
			{4229206868, 4234285011},
			{50143427, 53071093},
			{404422891, 410359316},
			{4161013486, 4161053283},
			{911138009, 929609461},
			{689609396, 696731723},
			{2252329659, 2256577065},
			{613133080, 613942155},
			{4795688, 12016953},
			{641672798, 650081964},
			{389776265, 420161914},
			{3625922134, 3642274972},
			{1846384495, 1862435820},
			{2275122654, 2286941521},
			{4005662252, 4011759888},
			{1579087992, 1581111352},
			{574652, 1770165},
			{1442180635, 1450176908},
			{2760767133, 2771395260},
			{1928232572, 1932533591},
			{102995855, 104909244},
			{4049179426, 4050691624},
			{2830630, 3651339},
			{3552827772, 3568200782},
			{2149613227, 2163021264},
			{1355394428, 1371491556},
			{1697279405, 1703102679},
			{2056763545, 2073554867},
			{3935325191, 3944187216},
			{3553082925, 3579924615},
			{471239627, 477134321},
			{3651340, 4795687},
			{336457769, 347991249},
			{93183635, 111293337},
			{2192128388, 2196145589},
			{2584811687, 2598361179},
			{2772743660, 2798530311},
			{966574237, 968633571},
			{4234775226, 4245296919},
			{3662498499, 3663349534},
			{1373549652, 1374239894},
			{58302860, 63670232},
			{1942772476, 1980855825},
			{3367790115, 3376760130},
			{153092723, 163571711},
			{729975675, 730335988},
			{2192513622, 2204700032},
			{809609217, 841628900},
			{1180032684, 1187000735},
			{1179227554, 1195640753},
			{4232727143, 4234293540},
			{1127122996, 1154171178},
			{314709697, 321232216},
			{324796849, 347951368},
			{1095126621, 1109642108},
			{384962939, 400102190},
			{363929652, 366175319},
			{3821851234, 3832391073},
			{338713138, 348077886},
			{817486506, 837487497},
			{1051940232, 1067333023},
			{19243172, 19587047},
			{257512323, 261464746},
			{1753791137, 1753975241},
			{202493249, 230688701},
			{1579363284, 1580767164},
			{2763246325, 2780813492},
			{2242297310, 2249800231},
			{1995459738, 2019539429},
			{573925402, 574462282},
			{3673851405, 3681451655},
			{3423327301, 3428356692},
			{3681451657, 3695852450},
			{3717161710, 3718982299},
			{2043127586, 2043244031},
			{2888999958, 2894304682},
			{2061236903, 2067109739},
			{2643879391, 2646512593},
			{1139540259, 1146292375},
			{3544236730, 3552827770},
			{2287385837, 2325334298},
			{3598404107, 3612936374},
			{3623885184, 3631095478},
			{1752497514, 1756572770},
			{2817718245, 2824409717},
			{679569338, 680230991},
			{4102130427, 4150245197},
			{1869463036, 1881600179},
			{286732642, 289325518},
			{2995454654, 3032053775},
			{1274816430, 1274830828},
			{4008677258, 4014358519},
			{248491486, 248842325},
			{1622000764, 1625125474},
			{1165689487, 1187305806},
			{3937241402, 3968405869},
			{4050691625, 4086243808},
			{3663349535, 3676933438},
			{2982918861, 2995454652},
			{1372603515, 1379417540},
			{2408455596, 2411739453},
			{201820937, 227275418},
			{1753934804, 1754073983},
			{2280075243, 2287385835},
			{2905919817, 2917493149},
			{2757562598, 2759204124},
			{1444583282, 1458937548},
			{1699259773, 1707790200},
			{1579284365, 1579540410},
			{624710045, 626772254},
			{2971742099, 2980188298},
			{3895219248, 3896408881},
			{1637216769, 1663878490},
			{1606776283, 1612157133},
			{1527331165, 1569579671},
			{1468822607, 1477434547},
			{3930477156, 3939796674},
			{4214551647, 4234775225},
			{1469208064, 1469259449},
			{4245296921, 4257493526},
			{3930128245, 3930477154},
		}
	}

	sort.Sort(Sortable(input))
	dbg("Have %d intervals", len(input))
	dbg("sorted input = %+v\n", input)

	var lowestAllowed uint32
	var highestForbidden uint32 = 0
	ln := len(input)
	// for the second part we assemble allowed intervals
	allowed := [][]uint32{}

	maxInt32 := uint32(math.Pow(2, 32) - 1)

	for i, r := range input {
		// first interval does not start at 0
		if i == 0 && r[0] != 0 {
			lowestAllowed = 0
			if !part2 {
				break
			}

			dbg("allowed in the beginning %d", i)
			allowed = append(allowed, []uint32{0, r[0] - 1})
			highestForbidden = r[1]
		}
		// hole in the blacklist
		if r[0] > highestForbidden+1 {
			lowestAllowed = highestForbidden + 1
			if !part2 {
				break
			}
			dbg("hole in the blacklist at %d, allowing interval %v", i, []uint32{highestForbidden + 1, r[0] - 1})
			allowed = append(allowed, []uint32{highestForbidden + 1, r[0] - 1})
			highestForbidden = r[1]
		}

		// interval completely overlapping
		if r[1] < highestForbidden {
			// ignore this interval, it is completely overlapping with what we have forbidden already
			dbg("completely overlapping %d", i)
			continue
		}

		// interval partially overlapping in the beginning
		highestForbidden = r[1]
		dbg("%d. highestForbidden=%v", i, highestForbidden)

		if highestForbidden >= maxInt32 {
			dbg("exiting at %d because the highest forbidden number is already at the limit, no more allowed IPs possible", i)
			break
		}

		if i == ln-1 {
			// last item
			lowestAllowed = highestForbidden + 1
			if part2 {
				// the rest of allowed intervals
				dbg("filling the rest")
				allowed = append(allowed, []uint32{lowestAllowed, maxInt32})
			}
		}
	}

	if !part2 {
		fmt.Printf("Lowest allowed: %d\n", lowestAllowed)
	} else {
		dbg("allowed %v", allowed)

		n := countAllowed(allowed)
		fmt.Println("Allowed IPs:", n)
	}
}

// iterates over a set of intervals and counts numbers in them, including boundaries
func countAllowed(a [][]uint32) int {
	var count int = 0
	for _, r := range a {
		count += int(r[1] - r[0] + 1)
	}
	return count
}

type Sortable [][]uint32

func (a Sortable) Len() int {
	return len(a)
}
func (a Sortable) Swap(i, j int) {
	a[i], a[j] = a[j], a[i]
}
func (a Sortable) Less(i, j int) bool {
	return a[i][0] < a[j][0]
}

func dbg(format string, params ...interface{}) {
	if !debug {
		return
	}
	fmt.Printf(format+"\n", params...)
}
