// eslint-disable-next-line import/no-anonymous-default-export
export default () => {



//   eslint-disable-next-line no-restricted-globals
  self.onmessage = (message) => {
    console.log("CALCUL WORKER HIT");
    let mogelijkeCombinaties = berekenMogelijkeCombinaties(message);
    postMessage(mogelijkeCombinaties);

  }


const berekenMogelijkeCombinaties = (message) => {
  let possibleWeekIDs = message.data[1].possibleWeekIDs;
  let missingShiftsWeek = message.data[1].missingShiftsWeek;
  let weeklyStructures = message.data[1].weeklyStructures;
  let mogelijkeCombinaties = [];


  let ontbrekendeShiften = [...missingShiftsWeek]
  let i = 0;
  //-----------------------------------------loop1----------------------------------------------------------------------------
  for (let index1 = 0; index1 < possibleWeekIDs[0].possibleWeeks.length; index1++) {

    let teBehalenWeekIndex1 = [...ontbrekendeShiften];
    let weekIndex1 = weeklyStructures.find(x => x.id === possibleWeekIDs[0].possibleWeeks[index1]);
    teBehalenWeekIndex1 = checkWeekVoorWerknemer(weekIndex1, teBehalenWeekIndex1);
    if (teBehalenWeekIndex1 === false) {
      continue;
    };

  //  -----------------------------------------loop2----------------------------------------------------------------------------
    for (let index2 = 0; index2 < possibleWeekIDs[1].possibleWeeks.length; index2++) {

      let weekIndex2 = weeklyStructures.find(x => x.id === possibleWeekIDs[1].possibleWeeks[index2]);
      let teBehalenWeekIndex2 = [...teBehalenWeekIndex1];
      teBehalenWeekIndex2 = checkWeekVoorWerknemer(weekIndex2, teBehalenWeekIndex2);
      if (teBehalenWeekIndex2 === false) {
        continue;
      };

     // -----------------------------------------loop3----------------------------------------------------------------------------
      for (let index3 = 0; index3 < possibleWeekIDs[2].possibleWeeks.length; index3++) {

        let weekIndex3 = weeklyStructures.find(x => x.id === possibleWeekIDs[2].possibleWeeks[index3]);
        let teBehalenWeekIndex3 = [...teBehalenWeekIndex2];
        teBehalenWeekIndex3 = checkWeekVoorWerknemer(weekIndex3, teBehalenWeekIndex3);
        if (teBehalenWeekIndex3 === false) {
          continue;
        };

      //  -----------------------------------------loop4---------------------------------------------------------------------------
        for (let index4 = 0; index4 < possibleWeekIDs[3].possibleWeeks.length; index4++) {

          let weekIndex4 = weeklyStructures.find(x => x.id === possibleWeekIDs[3].possibleWeeks[index4]);
          let teBehalenWeekIndex4 = [...teBehalenWeekIndex3];
          teBehalenWeekIndex4 = checkWeekVoorWerknemer(weekIndex4, teBehalenWeekIndex4);
          if (teBehalenWeekIndex4 === false) {
            continue;
          };

          //-----------------------------------------loop5---------------------------------------------------------------------------
          for (let index5 = 0; index5 < possibleWeekIDs[4].possibleWeeks.length; index5++) {

            let weekIndex5 = weeklyStructures.find(x => x.id === possibleWeekIDs[4].possibleWeeks[index5]);
            let teBehalenWeekIndex5 = [...teBehalenWeekIndex4];
            teBehalenWeekIndex5 = checkWeekVoorWerknemer(weekIndex5, teBehalenWeekIndex5);
            if (teBehalenWeekIndex5 === false) {
              continue;
            };

           // -----------------------------------------loop6---------------------------------------------------------------------------
            for (let index6 = 0; index6 < possibleWeekIDs[5].possibleWeeks.length; index6++) {

              let weekIndex6 = weeklyStructures.find(x => x.id === possibleWeekIDs[5].possibleWeeks[index6]);
              let teBehalenWeekIndex6 = [...teBehalenWeekIndex5];
              teBehalenWeekIndex6 = checkWeekVoorWerknemer(weekIndex6, teBehalenWeekIndex6);
              if (teBehalenWeekIndex6 === false) {
                continue;
              };

          //    -----------------------------------------loop7---------------------------------------------------------------------------
              for (let index7 = 0; index7 < possibleWeekIDs[6].possibleWeeks.length; index7++) {

                let weekIndex7 = weeklyStructures.find(x => x.id === possibleWeekIDs[6].possibleWeeks[index7]);
                let teBehalenWeekIndex7 = [...teBehalenWeekIndex6];
                teBehalenWeekIndex7 = checkWeekVoorWerknemer(weekIndex7, teBehalenWeekIndex7);
                if (teBehalenWeekIndex7 === false) {
                  continue;
                };

            //    -----------------------------------------loop8--------------------------------------------------------------------------
                for (let index8 = 0; index8 < possibleWeekIDs[7].possibleWeeks.length; index8++) {

                  let weekIndex8 = weeklyStructures.find(x => x.id === possibleWeekIDs[7].possibleWeeks[index8]);
                  let teBehalenWeekIndex8 = [...teBehalenWeekIndex7];
                  teBehalenWeekIndex8 = checkWeekVoorWerknemer(weekIndex8, teBehalenWeekIndex8);
                  if (teBehalenWeekIndex8 === false) {
                    continue;
                  };

                  let nietIngevuldeShiften = teBehalenWeekIndex8[0].length + teBehalenWeekIndex8[1].length + teBehalenWeekIndex8[2].length + teBehalenWeekIndex8[3].length + teBehalenWeekIndex8[4].length + teBehalenWeekIndex8[5].length + teBehalenWeekIndex8[6].length;

                  let hhulpVal = [
                    possibleWeekIDs[0].possibleWeeks[index1],
                    possibleWeekIDs[1].possibleWeeks[index2],
                    possibleWeekIDs[2].possibleWeeks[index3],
                    possibleWeekIDs[3].possibleWeeks[index4],
                    possibleWeekIDs[4].possibleWeeks[index5],
                    possibleWeekIDs[5].possibleWeeks[index6],
                    possibleWeekIDs[6].possibleWeeks[index7],
                    possibleWeekIDs[7].possibleWeeks[index8]
                  ]
                  if (!mogelijkeCombinaties.some(x => x.nietIngevuldeShiften === nietIngevuldeShiften)) {
                    mogelijkeCombinaties.push({
                      "nietIngevuldeShiften": nietIngevuldeShiften,
                      "combinaties": [hhulpVal],

                    })
                  } else {
                    let hulpIndex = mogelijkeCombinaties.findIndex(x => x.nietIngevuldeShiften === nietIngevuldeShiften);

                    mogelijkeCombinaties[hulpIndex].combinaties.push(hhulpVal)
                  }

                  index3++;
                  index4 = 1000;
                  index5 = 1000;
                  index6 = 1000;
                  index7 = 1000;
                  index8 = 1000;

                }
              }
            }
          }
        }
      }
    }



  }

  return mogelijkeCombinaties;
}

const checkWeekVoorWerknemer = (weekIndex, teBehalenWeekIndex) => {
  if (weekIndex.maandag !== "") {

    if (teBehalenWeekIndex[0].includes(weekIndex.maandag)) {
      let hulpDag = teBehalenWeekIndex[0];
      hulpDag = hulpDag.filter(x => weekIndex.maandag !== x);
      teBehalenWeekIndex[0] = hulpDag;
    } else {
      return false;
    }

  }
  if (weekIndex.dinsdag !== "") {
    if (teBehalenWeekIndex[1].includes(weekIndex.dinsdag)) {
      let hulpDag = teBehalenWeekIndex[1];
      hulpDag = hulpDag.filter(x => x !== weekIndex.dinsdag);
      teBehalenWeekIndex[1] = hulpDag;
    } else {
      return false;
    }

  }
  if (weekIndex.woensdag !== "") {
    if (teBehalenWeekIndex[2].includes(weekIndex.woensdag)) {
      let hulpDag = teBehalenWeekIndex[2];
      hulpDag = hulpDag.filter(x => x !== weekIndex.woensdag);
      teBehalenWeekIndex[2] = hulpDag;
    } else {
      return false;
    }

  }
  if (weekIndex.donderdag !== "") {
    if (teBehalenWeekIndex[3].includes(weekIndex.donderdag)) {
      let hulpDag = teBehalenWeekIndex[3];
      hulpDag = hulpDag.filter(x => x !== weekIndex.donderdag);
      teBehalenWeekIndex[3] = hulpDag;
    } else {
      return false;
    }

  }
  if (weekIndex.vrijdag !== "") {
    if (teBehalenWeekIndex[4].includes(weekIndex.vrijdag)) {
      let hulpDag = teBehalenWeekIndex[4];
      hulpDag = hulpDag.filter(x => x !== weekIndex.vrijdag);
      teBehalenWeekIndex[4] = hulpDag;
    } else {
      return false;
    }

  }
  if (weekIndex.zaterdag !== "") {
    if (teBehalenWeekIndex[5].includes(weekIndex.zaterdag)) {
      let hulpDag = teBehalenWeekIndex[5];
      hulpDag = hulpDag.filter(x => x !== weekIndex.zaterdag);
      teBehalenWeekIndex[5] = hulpDag;
    } else {
      return false;
    }

  }
  if (weekIndex.zondag !== "") {
    if (teBehalenWeekIndex[6].includes(weekIndex.zondag)) {
      let hulpDag = teBehalenWeekIndex[6];
      hulpDag = hulpDag.filter(x => x !== weekIndex.zondag);
      teBehalenWeekIndex[6] = hulpDag;
    } else {
      return false;
    }

  }

  return teBehalenWeekIndex;


}

};