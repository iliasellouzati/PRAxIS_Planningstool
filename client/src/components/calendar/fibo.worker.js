//fibo.worker.js
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

  let nachtShiften = ["1806", "1907"];
    let mogelijkeCombinaties;

    let hulpVal;
    let weekStructuren;



    // eslint-disable-next-line no-restricted-globals
    self.onmessage = (message) => {

      console.log(message);

      switch (message.data[0]) {
        case "ALLE_MOGELIJKHEDEN":
          berekenMogelijkeCombinaties(message);
          postMessage(mogelijkeCombinaties);
          break;

        case "FILTER_WEEKEND_EN_NACHT_INGEVULD":
          filterWeekendEndNacht(message.data[1]);
          postMessage(mogelijkeCombinaties);
          break;

        default:
          break;
      }



    };



  const filterWeekendEndNacht = (message) => {
    mogelijkeCombinaties = message.mogelijkeCombinaties;

    let OntbrekendeShiften = message.OntbrekendeShiften[message.weekNummer];
    let hulpVal_mogelijkeCombinaties;

    for (let index = 0; index < mogelijkeCombinaties.length; index++) {

      hulpVal_mogelijkeCombinaties = mogelijkeCombinaties[index];

      hulpVal_mogelijkeCombinaties.combinaties = mogelijkeCombinaties[index].combinaties.filter(weekCombo => weekBevatGeenNachtEnWeekendShiften(OntbrekendeShiften, weekCombo,message.weekStructuren));

      mogelijkeCombinaties[index] = hulpVal_mogelijkeCombinaties

    }

    let hulpVal_hulpVal = [];

    mogelijkeCombinaties.forEach(el => {
      hulpVal_hulpVal.push({
        "nietIngevuldeShiften": el.nietIngevuldeShiften,
        "combinaties": el.combinaties.length
      })
    });

    hulpVal = hulpVal_hulpVal;


  }

  const weekBevatGeenNachtEnWeekendShiften = (OntbrekendeShiften, weekCombo,weekStructuren) => {

    weekCombo.forEach(weekId => {
      let week = weekStructuren.find(x => x.id === weekId);
      if (week.maandag !== "") {
        let hulpDag = OntbrekendeShiften[0];
        hulpDag = hulpDag.filter(x => week.maandag !== x);
        OntbrekendeShiften[0] = hulpDag;
      }
      if (week.dinsdag !== "") {
        let hulpDag = OntbrekendeShiften[1];
        hulpDag = hulpDag.filter(x => week.dinsdag !== x);
        OntbrekendeShiften[1] = hulpDag;
      }
      if (week.woensdag !== "") {
        let hulpDag = OntbrekendeShiften[2];
        hulpDag = hulpDag.filter(x => week.woensdag !== x);
        OntbrekendeShiften[2] = hulpDag;
      }
      if (week.donderdag !== "") {
        let hulpDag = OntbrekendeShiften[3];
        hulpDag = hulpDag.filter(x => week.donderdag !== x);
        OntbrekendeShiften[3] = hulpDag;
      }
      if (week.vrijdag !== "") {
        let hulpDag = OntbrekendeShiften[4];
        hulpDag = hulpDag.filter(x => week.vrijdag !== x);
        OntbrekendeShiften[4] = hulpDag;
      }
      if (week.zaterdag !== "") {
        let hulpDag = OntbrekendeShiften[5];
        hulpDag = hulpDag.filter(x => week.zaterdag !== x);
        OntbrekendeShiften[5] = hulpDag;
      }
      if (week.zondag !== "") {
        let hulpDag = OntbrekendeShiften[6];
        hulpDag = hulpDag.filter(x => week.zondag !== x);
        OntbrekendeShiften[6] = hulpDag;
      }
    }

    )

    if (
      OntbrekendeShiften[0].some(a => nachtShiften.includes(a)) ||
      OntbrekendeShiften[1].some(a => nachtShiften.includes(a)) ||
      OntbrekendeShiften[2].some(a => nachtShiften.includes(a)) ||
      OntbrekendeShiften[3].some(a => nachtShiften.includes(a)) ||
      OntbrekendeShiften[4].some(a => nachtShiften.includes(a)) ||
      OntbrekendeShiften[5].length !== 0 ||
      OntbrekendeShiften[6].length !== 0) { return false }

    return true;

  }


  const berekenMogelijkeCombinaties = (message) => {
    let mogelijkeStructuren = message.data[1].mogelijkeStructuren;
    let week = message.data[1].weekNummer;
    let OntbrekendeShiften = message.data[1].OntbrekendeShiften;
    weekStructuren = message.data[1].weekStructuren;
    mogelijkeCombinaties = [];


    let ontbrekendeShiften = OntbrekendeShiften[week];
    let i = 0;
    //-----------------------------------------loop1----------------------------------------------------------------------------
    for (let index1 = 0; index1 < mogelijkeStructuren[0].length; index1 += 2) {

      let teBehalenWeekIndex1 = [...ontbrekendeShiften];
      let weekIndex1 = weekStructuren.find(x => x.id === mogelijkeStructuren[0][index1]);
      teBehalenWeekIndex1 = checkWeekVoorWerknemer(weekIndex1, teBehalenWeekIndex1);
      if (teBehalenWeekIndex1 === false) {
        continue;
      };
      console.log("first loop reached again");
      //-----------------------------------------loop2----------------------------------------------------------------------------
      for (let index2 = 0; index2 < mogelijkeStructuren[1].length; index2 += 2) {

        let weekIndex2 = weekStructuren.find(x => x.id === mogelijkeStructuren[1][index2]);
        let teBehalenWeekIndex2 = [...teBehalenWeekIndex1];
        teBehalenWeekIndex2 = checkWeekVoorWerknemer(weekIndex2, teBehalenWeekIndex2);
        if (teBehalenWeekIndex2 === false) {
          continue;
        };

        //-----------------------------------------loop3----------------------------------------------------------------------------
        for (let index3 = 0; index3 < mogelijkeStructuren[2].length; index3++) {

          let weekIndex3 = weekStructuren.find(x => x.id === mogelijkeStructuren[2][index3]);
          let teBehalenWeekIndex3 = [...teBehalenWeekIndex2];
          teBehalenWeekIndex3 = checkWeekVoorWerknemer(weekIndex3, teBehalenWeekIndex3);
          if (teBehalenWeekIndex3 === false) {
            continue;
          };

          //-----------------------------------------loop4---------------------------------------------------------------------------
          for (let index4 = 0; index4 < mogelijkeStructuren[3].length; index4++) {

            let weekIndex4 = weekStructuren.find(x => x.id === mogelijkeStructuren[3][index4]);
            let teBehalenWeekIndex4 = [...teBehalenWeekIndex3];
            teBehalenWeekIndex4 = checkWeekVoorWerknemer(weekIndex4, teBehalenWeekIndex4);
            if (teBehalenWeekIndex4 === false) {
              continue;
            };

            //-----------------------------------------loop5---------------------------------------------------------------------------
            for (let index5 = 0; index5 < mogelijkeStructuren[4].length; index5++) {

              let weekIndex5 = weekStructuren.find(x => x.id === mogelijkeStructuren[4][index5]);
              let teBehalenWeekIndex5 = [...teBehalenWeekIndex4];
              teBehalenWeekIndex5 = checkWeekVoorWerknemer(weekIndex5, teBehalenWeekIndex5);
              if (teBehalenWeekIndex5 === false) {
                continue;
              };

              //-----------------------------------------loop6---------------------------------------------------------------------------
              for (let index6 = 0; index6 < mogelijkeStructuren[5].length; index6++) {

                let weekIndex6 = weekStructuren.find(x => x.id === mogelijkeStructuren[5][index6]);
                let teBehalenWeekIndex6 = [...teBehalenWeekIndex5];
                teBehalenWeekIndex6 = checkWeekVoorWerknemer(weekIndex6, teBehalenWeekIndex6);
                if (teBehalenWeekIndex6 === false) {
                  continue;
                };

                //-----------------------------------------loop7---------------------------------------------------------------------------
                for (let index7 = 0; index7 < mogelijkeStructuren[6].length; index7++) {

                  let weekIndex7 = weekStructuren.find(x => x.id === mogelijkeStructuren[6][index7]);
                  let teBehalenWeekIndex7 = [...teBehalenWeekIndex6];
                  teBehalenWeekIndex7 = checkWeekVoorWerknemer(weekIndex7, teBehalenWeekIndex7);
                  if (teBehalenWeekIndex7 === false) {
                    continue;
                  };

                  //-----------------------------------------loop8--------------------------------------------------------------------------
                  for (let index8 = 0; index8 < mogelijkeStructuren[7].length; index8++) {

                    let weekIndex8 = weekStructuren.find(x => x.id === mogelijkeStructuren[7][index8]);
                    let teBehalenWeekIndex8 = [...teBehalenWeekIndex7];
                    teBehalenWeekIndex8 = checkWeekVoorWerknemer(weekIndex8, teBehalenWeekIndex8);
                    if (teBehalenWeekIndex8 === false) {
                      continue;
                    };

                    let nietIngevuldeShiften = teBehalenWeekIndex8[0].length + teBehalenWeekIndex8[1].length + teBehalenWeekIndex8[2].length + teBehalenWeekIndex8[3].length + teBehalenWeekIndex8[4].length + teBehalenWeekIndex8[5].length + teBehalenWeekIndex8[6].length;








                    if (!mogelijkeCombinaties.some(x => x.nietIngevuldeShiften === nietIngevuldeShiften)) {
                      let hhulpVal = [
                        mogelijkeStructuren[0][index1],
                        mogelijkeStructuren[1][index2],
                        mogelijkeStructuren[2][index3],
                        mogelijkeStructuren[3][index4],
                        mogelijkeStructuren[4][index5],
                        mogelijkeStructuren[5][index6],
                        mogelijkeStructuren[6][index7],
                        mogelijkeStructuren[7][index8]
                      ]
                      mogelijkeCombinaties.push({
                        "nietIngevuldeShiften": nietIngevuldeShiften,
                        "combinaties": [hhulpVal]
                      })
                    } else {
                      let hulpIndex = mogelijkeCombinaties.findIndex(x => x.nietIngevuldeShiften === nietIngevuldeShiften);
                      let hhulpVal = [
                        mogelijkeStructuren[0][index1],
                        mogelijkeStructuren[1][index2],
                        mogelijkeStructuren[2][index3],
                        mogelijkeStructuren[3][index4],
                        mogelijkeStructuren[4][index5],
                        mogelijkeStructuren[5][index6],
                        mogelijkeStructuren[6][index7],
                        mogelijkeStructuren[7][index8]
                      ]
                      mogelijkeCombinaties[hulpIndex].combinaties.push(hhulpVal)
                    }



                    if (message.data[1].express === true) {
                      index2++;
                      index3 = 1000;
                      index4 = 1000;
                      index5 = 1000;
                      index6 = 1000;
                      index7 = 1000;
                      index8 = 1000;
                    }

                    // dispatchWeek(week);


                  }
                }
              }
            }
          }
        }
      }



    }


    // postMessage(mogelijkeCombinaties);

    hulpVal = [];

    mogelijkeCombinaties.forEach(el => {
      hulpVal.push({
        "nietIngevuldeShiften": el.nietIngevuldeShiften,
        "combinaties": el.combinaties.length
      })
    });

  }

  const checkWeekVoorWerknemer = (weekIndex, teBehalenWeekIndex) => {
    if (weekIndex.maandag !== "") {

      if (teBehalenWeekIndex[0].includes(weekIndex.maandag)) {
        let hulpDag = teBehalenWeekIndex[0];
        hulpDag = hulpDag.filter(x => weekIndex.maandag !== x);
        teBehalenWeekIndex[0] = hulpDag;
      }
      else {
        return false;
      }

    }
    if (weekIndex.dinsdag !== "") {
      if (teBehalenWeekIndex[1].includes(weekIndex.dinsdag)) {
        let hulpDag = teBehalenWeekIndex[1];
        hulpDag = hulpDag.filter(x => x !== weekIndex.dinsdag);
        teBehalenWeekIndex[1] = hulpDag;
      }
      else {
        return false;
      }

    }
    if (weekIndex.woensdag !== "") {
      if (teBehalenWeekIndex[2].includes(weekIndex.woensdag)) {
        let hulpDag = teBehalenWeekIndex[2];
        hulpDag = hulpDag.filter(x => x !== weekIndex.woensdag);
        teBehalenWeekIndex[2] = hulpDag;
      }
      else {
        return false;
      }

    }
    if (weekIndex.donderdag !== "") {
      if (teBehalenWeekIndex[3].includes(weekIndex.donderdag)) {
        let hulpDag = teBehalenWeekIndex[3];
        hulpDag = hulpDag.filter(x => x !== weekIndex.donderdag);
        teBehalenWeekIndex[3] = hulpDag;
      }
      else {
        return false;
      }

    }
    if (weekIndex.vrijdag !== "") {
      if (teBehalenWeekIndex[4].includes(weekIndex.vrijdag)) {
        let hulpDag = teBehalenWeekIndex[4];
        hulpDag = hulpDag.filter(x => x !== weekIndex.vrijdag);
        teBehalenWeekIndex[4] = hulpDag;
      }
      else {
        return false;
      }

    }
    if (weekIndex.zaterdag !== "") {
      if (teBehalenWeekIndex[5].includes(weekIndex.zaterdag)) {
        let hulpDag = teBehalenWeekIndex[5];
        hulpDag = hulpDag.filter(x => x !== weekIndex.zaterdag);
        teBehalenWeekIndex[5] = hulpDag;
      }
      else {
        return false;
      }

    }
    if (weekIndex.zondag !== "") {
      if (teBehalenWeekIndex[6].includes(weekIndex.zondag)) {
        let hulpDag = teBehalenWeekIndex[6];
        hulpDag = hulpDag.filter(x => x !== weekIndex.zondag);
        teBehalenWeekIndex[6] = hulpDag;
      }
      else {
        return false;
      }

    }

    return teBehalenWeekIndex;


  }

};