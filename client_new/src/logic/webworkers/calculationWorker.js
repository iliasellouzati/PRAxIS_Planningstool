/* eslint-disable no-loop-func */
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {



  //   eslint-disable-next-line no-restricted-globals
  self.onmessage = (message) => {
    let mogelijkeCombinaties = berekenMogelijkeCombinaties(message);
    postMessage(mogelijkeCombinaties);

  }


  const berekenMogelijkeCombinaties = (message) => {
    let possibleWeekIDs = message.data[1].possibleWeekIDs;
    let missingShiftsWeek = message.data[1].missingShiftsWeek[0];
    let weeklyStructures = message.data[1].weeklyStructures;
    let incompatibelWeeks = message.data[1].incompatibelWeeks;
    let filters = message.data[1].filters;

    let mogelijkeCombinaties = [];


    let IDS = possibleWeekIDs.filter(x => x.possibleWeeks.length !== 0);


    let employeesSize = IDS.length;

    if (employeesSize < 3 || employeesSize > 15) {
      return null
    }



    //-----------------------------------------loop1----------------------------------------------------------------------------
    for (let index1 = 0; index1 < IDS[0].possibleWeeks.length; index1++) {
      //  -----------------------------------------loop2----------------------------------------------------------------------------
      for (let index2 = 0; index2 < IDS[1].possibleWeeks.filter(x =>
          !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x)
        ).length; index2++) {
        // -----------------------------------------loop3----------------------------------------------------------------------------
        for (let index3 = 0; index3 < IDS[2].possibleWeeks.filter(x =>
            !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
            !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x)
          ).length; index3++) {
          if (employeesSize > 3) {
            //  -----------------------------------------loop4---------------------------------------------------------------------------
            for (let index4 = 0; index4 < IDS[3].possibleWeeks.filter(x =>
                !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x)
              ).length; index4++) {
              if (employeesSize > 4) {
                //-----------------------------------------loop5---------------------------------------------------------------------------
                for (let index5 = 0; index5 < IDS[4].possibleWeeks.filter(x =>
                    !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                    !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                    !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                    !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x)
                  ).length; index5++) {
                  if (employeesSize > 5) {
                    //-----------------------------------------loop6---------------------------------------------------------------------------
                    for (let index6 = 0; index6 < IDS[5].possibleWeeks.filter(x =>
                        !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                        !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                        !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                        !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                        !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x)
                      ).length; index6++) {
                      if (employeesSize > 6) {
                        //-----------------------------------------loop7---------------------------------------------------------------------------
                        for (let index7 = 0; index7 < IDS[6].possibleWeeks.filter(x =>
                            !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                            !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                            !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                            !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                            !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                            !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x)
                          ).length; index7++) {
                          if (employeesSize > 7) {
                            //-----------------------------------------loop8--------------------------------------------------------------------------
                            for (let index8 = 0; index8 < IDS[7].possibleWeeks.filter(x =>
                                !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                                !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                                !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                                !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                                !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                                !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x) ||
                                !incompatibelWeeks[`${IDS[6].possibleWeeks[index7]}`].includes(x)
                              ).length; index8++) {
                              if (employeesSize > 8) {
                                //-----------------------------------------loop9--------------------------------------------------------------------------
                                for (let index9 = 0; index9 < IDS[8].possibleWeeks.filter(x =>
                                    !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                                    !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                                    !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                                    !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                                    !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                                    !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x) ||
                                    !incompatibelWeeks[`${IDS[6].possibleWeeks[index7]}`].includes(x) ||
                                    !incompatibelWeeks[`${IDS[7].possibleWeeks[index8]}`].includes(x)
                                  ).length; index9++) {
                                  if (employeesSize > 9) {
                                    //-----------------------------------------loop10--------------------------------------------------------------------------
                                    for (let index10 = 0; index10 < IDS[9].possibleWeeks.filter(x =>
                                        !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                                        !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                                        !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                                        !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                                        !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                                        !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x) ||
                                        !incompatibelWeeks[`${IDS[6].possibleWeeks[index7]}`].includes(x) ||
                                        !incompatibelWeeks[`${IDS[7].possibleWeeks[index8]}`].includes(x) ||
                                        !incompatibelWeeks[`${IDS[8].possibleWeeks[index9]}`].includes(x)
                                      ).length; index10++) {
                                      if (employeesSize > 10) {
                                        //-----------------------------------------loop11--------------------------------------------------------------------------
                                        for (let index11 = 0; index11 < IDS[10].possibleWeeks.filter(x =>
                                            !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[6].possibleWeeks[index7]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[7].possibleWeeks[index8]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[8].possibleWeeks[index9]}`].includes(x) ||
                                            !incompatibelWeeks[`${IDS[9].possibleWeeks[index10]}`].includes(x)
                                          ).length; index11++) {
                                          if (employeesSize > 11) {
                                            //-----------------------------------------loop12--------------------------------------------------------------------------
                                            for (let index12 = 0; index12 < IDS[11].possibleWeeks.filter(x =>
                                                !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[6].possibleWeeks[index7]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[7].possibleWeeks[index8]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[8].possibleWeeks[index9]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[9].possibleWeeks[index10]}`].includes(x) ||
                                                !incompatibelWeeks[`${IDS[10].possibleWeeks[index11]}`].includes(x)
                                              ).length; index12++) {
                                              if (employeesSize > 12) {
                                                //-----------------------------------------loop13--------------------------------------------------------------------------
                                                for (let index13 = 0; index13 < IDS[12].possibleWeeks.filter(x =>
                                                    !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[6].possibleWeeks[index7]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[7].possibleWeeks[index8]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[8].possibleWeeks[index9]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[9].possibleWeeks[index10]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[10].possibleWeeks[index11]}`].includes(x) ||
                                                    !incompatibelWeeks[`${IDS[11].possibleWeeks[index12]}`].includes(x)
                                                  ).length; index13++) {
                                                  if (employeesSize > 13) {
                                                    //-----------------------------------------loop14--------------------------------------------------------------------------
                                                    for (let index14 = 0; index14 < IDS[13].possibleWeeks.filter(x =>
                                                        !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[6].possibleWeeks[index7]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[7].possibleWeeks[index8]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[8].possibleWeeks[index9]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[9].possibleWeeks[index10]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[10].possibleWeeks[index11]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[11].possibleWeeks[index12]}`].includes(x) ||
                                                        !incompatibelWeeks[`${IDS[12].possibleWeeks[index13]}`].includes(x)
                                                      ).length; index14++) {
                                                      if (employeesSize > 14) {
                                                        //-----------------------------------------loop15--------------------------------------------------------------------------
                                                        for (let index15 = 0; index15 < IDS[14].possibleWeeks.filter(x =>
                                                            !incompatibelWeeks[`${IDS[0].possibleWeeks[index1]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[1].possibleWeeks[index2]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[2].possibleWeeks[index3]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[3].possibleWeeks[index4]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[4].possibleWeeks[index5]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[5].possibleWeeks[index6]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[6].possibleWeeks[index7]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[7].possibleWeeks[index8]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[8].possibleWeeks[index9]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[9].possibleWeeks[index10]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[10].possibleWeeks[index11]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[11].possibleWeeks[index12]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[12].possibleWeeks[index13]}`].includes(x) ||
                                                            !incompatibelWeeks[`${IDS[13].possibleWeeks[index14]}`].includes(x)).length; index15++) {

                                                          let respons = berekenEindeLoop({
                                                            'arrayWeekIdCombo': [
                                                              IDS[0].possibleWeeks[index1],
                                                              IDS[1].possibleWeeks[index2],
                                                              IDS[2].possibleWeeks[index3],
                                                              IDS[3].possibleWeeks[index4],
                                                              IDS[4].possibleWeeks[index5],
                                                              IDS[5].possibleWeeks[index6],
                                                              IDS[6].possibleWeeks[index7],
                                                              IDS[7].possibleWeeks[index8],
                                                              IDS[8].possibleWeeks[index9],
                                                              IDS[9].possibleWeeks[index10],
                                                              IDS[10].possibleWeeks[index11],
                                                              IDS[11].possibleWeeks[index12],
                                                              IDS[12].possibleWeeks[index13],
                                                              IDS[13].possibleWeeks[index14],
                                                              IDS[14].possibleWeeks[index15]
                                                            ],
                                                            'employeeIDS': [
                                                              IDS[0].employeeId,
                                                              IDS[1].employeeId,
                                                              IDS[2].employeeId,
                                                              IDS[3].employeeId,
                                                              IDS[4].employeeId,
                                                              IDS[5].employeeId,
                                                              IDS[6].employeeId,
                                                              IDS[7].employeeId,
                                                              IDS[8].employeeId,
                                                              IDS[9].employeeId,
                                                              IDS[10].employeeId,
                                                              IDS[11].employeeId,
                                                              IDS[12].employeeId,
                                                              IDS[13].employeeId,
                                                              IDS[14].employeeId
                                                            ],
                                                            'weeklyStructures': weeklyStructures,
                                                            'filters': filters,
                                                            'missingShiftsWeek': missingShiftsWeek
                                                          });
                                                          if (respons !== false) {
                                                            if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                                              mogelijkeCombinaties.push(respons)
                                                            } else {
                                                              let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                              mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                                            }
                                                          }

                                                          //end loop15
                                                        }
                                                      } else {
                                                        let respons = berekenEindeLoop({
                                                          'arrayWeekIdCombo': [
                                                            IDS[0].possibleWeeks[index1],
                                                            IDS[1].possibleWeeks[index2],
                                                            IDS[2].possibleWeeks[index3],
                                                            IDS[3].possibleWeeks[index4],
                                                            IDS[4].possibleWeeks[index5],
                                                            IDS[5].possibleWeeks[index6],
                                                            IDS[6].possibleWeeks[index7],
                                                            IDS[7].possibleWeeks[index8],
                                                            IDS[8].possibleWeeks[index9],
                                                            IDS[9].possibleWeeks[index10],
                                                            IDS[10].possibleWeeks[index11],
                                                            IDS[11].possibleWeeks[index12],
                                                            IDS[12].possibleWeeks[index13],
                                                            IDS[13].possibleWeeks[index14]
                                                          ],
                                                          'employeeIDS': [
                                                            IDS[0].employeeId,
                                                            IDS[1].employeeId,
                                                            IDS[2].employeeId,
                                                            IDS[3].employeeId,
                                                            IDS[4].employeeId,
                                                            IDS[5].employeeId,
                                                            IDS[6].employeeId,
                                                            IDS[7].employeeId,
                                                            IDS[8].employeeId,
                                                            IDS[9].employeeId,
                                                            IDS[10].employeeId,
                                                            IDS[11].employeeId,
                                                            IDS[12].employeeId,
                                                            IDS[13].employeeId
                                                          ],
                                                          'weeklyStructures': weeklyStructures,
                                                          'filters': filters,
                                                          'missingShiftsWeek': missingShiftsWeek
                                                        });
                                                        if (respons !== false) {
                                                          if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                                            mogelijkeCombinaties.push(respons)
                                                          } else {
                                                            let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                            mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                                          }
                                                        }

                                                      }
                                                      //end loop14
                                                    }
                                                  } else {
                                                    let respons = berekenEindeLoop({
                                                      'arrayWeekIdCombo': [
                                                        IDS[0].possibleWeeks[index1],
                                                        IDS[1].possibleWeeks[index2],
                                                        IDS[2].possibleWeeks[index3],
                                                        IDS[3].possibleWeeks[index4],
                                                        IDS[4].possibleWeeks[index5],
                                                        IDS[5].possibleWeeks[index6],
                                                        IDS[6].possibleWeeks[index7],
                                                        IDS[7].possibleWeeks[index8],
                                                        IDS[8].possibleWeeks[index9],
                                                        IDS[9].possibleWeeks[index10],
                                                        IDS[10].possibleWeeks[index11],
                                                        IDS[11].possibleWeeks[index12],
                                                        IDS[12].possibleWeeks[index13]
                                                      ],
                                                      'employeeIDS': [
                                                        IDS[0].employeeId,
                                                        IDS[1].employeeId,
                                                        IDS[2].employeeId,
                                                        IDS[3].employeeId,
                                                        IDS[4].employeeId,
                                                        IDS[5].employeeId,
                                                        IDS[6].employeeId,
                                                        IDS[7].employeeId,
                                                        IDS[8].employeeId,
                                                        IDS[9].employeeId,
                                                        IDS[10].employeeId,
                                                        IDS[11].employeeId,
                                                        IDS[12].employeeId
                                                      ],
                                                      'weeklyStructures': weeklyStructures,
                                                      'filters': filters,
                                                      'missingShiftsWeek': missingShiftsWeek
                                                    });
                                                    if (respons !== false) {
                                                      if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                                        mogelijkeCombinaties.push(respons)
                                                      } else {
                                                        let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                        mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                                      }
                                                    }
                                                  }
                                                  //end loop13
                                                }
                                              } else {
                                                let respons = berekenEindeLoop({
                                                  'arrayWeekIdCombo': [
                                                    IDS[0].possibleWeeks[index1],
                                                    IDS[1].possibleWeeks[index2],
                                                    IDS[2].possibleWeeks[index3],
                                                    IDS[3].possibleWeeks[index4],
                                                    IDS[4].possibleWeeks[index5],
                                                    IDS[5].possibleWeeks[index6],
                                                    IDS[6].possibleWeeks[index7],
                                                    IDS[7].possibleWeeks[index8],
                                                    IDS[8].possibleWeeks[index9],
                                                    IDS[9].possibleWeeks[index10],
                                                    IDS[10].possibleWeeks[index11],
                                                    IDS[11].possibleWeeks[index12]
                                                  ],
                                                  'employeeIDS': [
                                                    IDS[0].employeeId,
                                                    IDS[1].employeeId,
                                                    IDS[2].employeeId,
                                                    IDS[3].employeeId,
                                                    IDS[4].employeeId,
                                                    IDS[5].employeeId,
                                                    IDS[6].employeeId,
                                                    IDS[7].employeeId,
                                                    IDS[8].employeeId,
                                                    IDS[9].employeeId,
                                                    IDS[10].employeeId,
                                                    IDS[11].employeeId
                                                  ],
                                                  'weeklyStructures': weeklyStructures,
                                                  'filters': filters,
                                                  'missingShiftsWeek': missingShiftsWeek
                                                });
                                                if (respons !== false) {
                                                  if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                                    mogelijkeCombinaties.push(respons)
                                                  } else {
                                                    let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                    mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                                  }
                                                }
                                              }
                                              //end loop12
                                            }
                                          } else {
                                            let respons = berekenEindeLoop({
                                              'arrayWeekIdCombo': [
                                                IDS[0].possibleWeeks[index1],
                                                IDS[1].possibleWeeks[index2],
                                                IDS[2].possibleWeeks[index3],
                                                IDS[3].possibleWeeks[index4],
                                                IDS[4].possibleWeeks[index5],
                                                IDS[5].possibleWeeks[index6],
                                                IDS[6].possibleWeeks[index7],
                                                IDS[7].possibleWeeks[index8],
                                                IDS[8].possibleWeeks[index9],
                                                IDS[9].possibleWeeks[index10],
                                                IDS[10].possibleWeeks[index11]
                                              ],
                                              'employeeIDS': [
                                                IDS[0].employeeId,
                                                IDS[1].employeeId,
                                                IDS[2].employeeId,
                                                IDS[3].employeeId,
                                                IDS[4].employeeId,
                                                IDS[5].employeeId,
                                                IDS[6].employeeId,
                                                IDS[7].employeeId,
                                                IDS[8].employeeId,
                                                IDS[9].employeeId,
                                                IDS[10].employeeId
                                              ],
                                              'weeklyStructures': weeklyStructures,
                                              'filters': filters,
                                              'missingShiftsWeek': missingShiftsWeek
                                            });
                                            if (respons !== false) {
                                              if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                                mogelijkeCombinaties.push(respons)
                                              } else {
                                                let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                              }
                                            }
                                          }
                                          //end loop11
                                        }
                                      } else {
                                        let respons = berekenEindeLoop({
                                          'arrayWeekIdCombo': [
                                            IDS[0].possibleWeeks[index1],
                                            IDS[1].possibleWeeks[index2],
                                            IDS[2].possibleWeeks[index3],
                                            IDS[3].possibleWeeks[index4],
                                            IDS[4].possibleWeeks[index5],
                                            IDS[5].possibleWeeks[index6],
                                            IDS[6].possibleWeeks[index7],
                                            IDS[7].possibleWeeks[index8],
                                            IDS[8].possibleWeeks[index9],
                                            IDS[9].possibleWeeks[index10]
                                          ],
                                          'employeeIDS': [
                                            IDS[0].employeeId,
                                            IDS[1].employeeId,
                                            IDS[2].employeeId,
                                            IDS[3].employeeId,
                                            IDS[4].employeeId,
                                            IDS[5].employeeId,
                                            IDS[6].employeeId,
                                            IDS[7].employeeId,
                                            IDS[8].employeeId,
                                            IDS[9].employeeId
                                          ],
                                          'weeklyStructures': weeklyStructures,
                                          'filters': filters,
                                          'missingShiftsWeek': missingShiftsWeek
                                        });
                                        if (respons !== false) {
                                          if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                            mogelijkeCombinaties.push(respons)
                                          } else {
                                            let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                            mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                          }
                                        }
                                      }
                                      //end loop10
                                    }
                                  } else {
                                    let respons = berekenEindeLoop({
                                      'arrayWeekIdCombo': [
                                        IDS[0].possibleWeeks[index1],
                                        IDS[1].possibleWeeks[index2],
                                        IDS[2].possibleWeeks[index3],
                                        IDS[3].possibleWeeks[index4],
                                        IDS[4].possibleWeeks[index5],
                                        IDS[5].possibleWeeks[index6],
                                        IDS[6].possibleWeeks[index7],
                                        IDS[7].possibleWeeks[index8],
                                        IDS[8].possibleWeeks[index9]
                                      ],
                                      'employeeIDS': [
                                        IDS[0].employeeId,
                                        IDS[1].employeeId,
                                        IDS[2].employeeId,
                                        IDS[3].employeeId,
                                        IDS[4].employeeId,
                                        IDS[5].employeeId,
                                        IDS[6].employeeId,
                                        IDS[7].employeeId,
                                        IDS[8].employeeId
                                      ],
                                      'weeklyStructures': weeklyStructures,
                                      'filters': filters,
                                      'missingShiftsWeek': missingShiftsWeek
                                    });
                                    if (respons !== false) {
                                      if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                        mogelijkeCombinaties.push(respons)
                                      } else {
                                        let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                        mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                      }
                                    }
                                  }
                                  //end loop9
                                }
                              } else {
                                let respons = berekenEindeLoop({
                                  'arrayWeekIdCombo': [
                                    IDS[0].possibleWeeks[index1],
                                    IDS[1].possibleWeeks[index2],
                                    IDS[2].possibleWeeks[index3],
                                    IDS[3].possibleWeeks[index4],
                                    IDS[4].possibleWeeks[index5],
                                    IDS[5].possibleWeeks[index6],
                                    IDS[6].possibleWeeks[index7],
                                    IDS[7].possibleWeeks[index8]
                                  ],
                                  'employeeIDS': [
                                    IDS[0].employeeId,
                                    IDS[1].employeeId,
                                    IDS[2].employeeId,
                                    IDS[3].employeeId,
                                    IDS[4].employeeId,
                                    IDS[5].employeeId,
                                    IDS[6].employeeId,
                                    IDS[7].employeeId
                                  ],
                                  'weeklyStructures': weeklyStructures,
                                  'filters': filters,
                                  'missingShiftsWeek': missingShiftsWeek
                                });
                                if (respons !== false) {
                                  if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                    mogelijkeCombinaties.push(respons)
                                  } else {
                                    let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                    mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                  }
                                }



                                index5 = 1000;
                                index6 = 1000;
                                index7 = 1000;
                                index8 = 1000;

                              }
                              //end loop8
                            }
                          } else {
                            let respons = berekenEindeLoop({
                              'arrayWeekIdCombo': [
                                IDS[0].possibleWeeks[index1],
                                IDS[1].possibleWeeks[index2],
                                IDS[2].possibleWeeks[index3],
                                IDS[3].possibleWeeks[index4],
                                IDS[4].possibleWeeks[index5],
                                IDS[5].possibleWeeks[index6],
                                IDS[6].possibleWeeks[index7]
                              ],
                              'employeeIDS': [
                                IDS[0].employeeId,
                                IDS[1].employeeId,
                                IDS[2].employeeId,
                                IDS[3].employeeId,
                                IDS[4].employeeId,
                                IDS[5].employeeId,
                                IDS[6].employeeId
                              ],
                              'weeklyStructures': weeklyStructures,
                              'filters': filters,
                              'missingShiftsWeek': missingShiftsWeek
                            });
                            if (respons !== false) {
                              if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                                mogelijkeCombinaties.push(respons)
                              } else {
                                let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                              }
                            }


                            index5 = 1000;
                            index6 = 1000;
                            index7 = 1000;

                          }
                          //end loop7   
                        }
                      } else {
                        let respons = berekenEindeLoop({
                          'arrayWeekIdCombo': [
                            IDS[0].possibleWeeks[index1],
                            IDS[1].possibleWeeks[index2],
                            IDS[2].possibleWeeks[index3],
                            IDS[3].possibleWeeks[index4],
                            IDS[4].possibleWeeks[index5],
                            IDS[5].possibleWeeks[index6]
                          ],
                          'employeeIDS': [
                            IDS[0].employeeId,
                            IDS[1].employeeId,
                            IDS[2].employeeId,
                            IDS[3].employeeId,
                            IDS[4].employeeId,
                            IDS[5].employeeId
                          ],
                          'weeklyStructures': weeklyStructures,
                          'filters': filters,
                          'missingShiftsWeek': missingShiftsWeek
                        });
                        if (respons !== false) {
                          if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                            mogelijkeCombinaties.push(respons)
                          } else {
                            let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                            mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                          }
                        }


                        index5 = 1000;
                        index6 = 1000;
                      }
                      //end loop6
                    }
                  } else {
                    let respons = berekenEindeLoop({
                      'arrayWeekIdCombo': [
                        IDS[0].possibleWeeks[index1],
                        IDS[1].possibleWeeks[index2],
                        IDS[2].possibleWeeks[index3],
                        IDS[3].possibleWeeks[index4],
                        IDS[4].possibleWeeks[index5]
                      ],
                      'employeeIDS': [
                        IDS[0].employeeId,
                        IDS[1].employeeId,
                        IDS[2].employeeId,
                        IDS[3].employeeId,
                        IDS[4].employeeId
                      ],
                      'weeklyStructures': weeklyStructures,
                      'filters': filters,
                      'missingShiftsWeek': missingShiftsWeek
                    });
                    if (respons !== false) {
                      if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                        mogelijkeCombinaties.push(respons)
                      } else {
                        let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                        mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                      }
                    }


                    index5 = 1000;
                  }
                  //end loop5
                }
              } else {
                let respons = berekenEindeLoop({
                  'arrayWeekIdCombo': [
                    IDS[0].possibleWeeks[index1],
                    IDS[1].possibleWeeks[index2],
                    IDS[2].possibleWeeks[index3],
                    IDS[3].possibleWeeks[index4]
                  ],
                  'employeeIDS': [
                    IDS[0].employeeId,
                    IDS[1].employeeId,
                    IDS[2].employeeId,
                    IDS[3].employeeId
                  ],
                  'weeklyStructures': weeklyStructures,
                  'filters': filters,
                  'missingShiftsWeek': missingShiftsWeek
                });
                if (respons !== false) {
                  if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                    mogelijkeCombinaties.push(respons)
                  } else {
                    let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                    mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                  }
                }

              }
              //end loop4 
            }
          } else {
            let respons = berekenEindeLoop({
              'arrayWeekIdCombo': [
                IDS[0].possibleWeeks[index1],
                IDS[1].possibleWeeks[index2],
                IDS[2].possibleWeeks[index3]
              ],
              'employeeIDS': [
                IDS[0].employeeId,
                IDS[1].employeeId,
                IDS[2].employeeId
              ],
              'weeklyStructures': weeklyStructures,
              'filters': filters,
              'missingShiftsWeek': missingShiftsWeek[0]
            });
            if (respons !== false) {
              if (!mogelijkeCombinaties.some(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften)) {
                mogelijkeCombinaties.push(respons)
              } else {
                let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
              }
            }



          }
          //end loop3
        }
        //end loop2
      }
      //end loop1   
    }

    return mogelijkeCombinaties;
  }

  const berekenEindeLoop = ({
    arrayWeekIdCombo,
    weeklyStructures,
    employeeIDS,
    filters,
    missingShiftsWeek
  }) => {


    let returnValue=[];
    let totaalShiften = 0;
    let missingShifts = missingShiftsWeek

    arrayWeekIdCombo.forEach((weekId,index) => {
      let week = weeklyStructures.find(x => x.id === weekId);


      if (week.maandag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[0] = missingShifts[0].filter(x => x !== week.maandag);
        }
      }
      if (week.dinsdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[1] = missingShifts[1].filter(x => x !== week.dinsdag);
        }
      }
      if (week.woensdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[2] = missingShifts[2].filter(x => x !== week.woensdag);
        }
      }
      if (week.donderdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[3] = missingShifts[3].filter(x => x !== week.donderdag);
        }
      }
      if (week.vrijdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[4] = missingShifts[4].filter(x => x !== week.vrijdag);
        }
      }
      if (week.zaterdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[5] = missingShifts[5].filter(x => x !== week.zaterdag);
        }
      }
      if (week.zondag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[6] = missingShifts[6].filter(x => x !== week.zondag);
        }
      }

      returnValue.push({'empId':employeeIDS[index],'weekId':weekId})

    });

    if (filters.some(x => x === "NACHT_WEEKEND_GEVULD") && (

        missingShifts[0].some(x => x === '1806' || x === '1907') ||
        missingShifts[1].some(x => x === '1806' || x === '1907') ||
        missingShifts[2].some(x => x === '1806' || x === '1907') ||
        missingShifts[3].some(x => x === '1806' || x === '1907') ||
        missingShifts[4].some(x => x === '1806' || x === '1907') ||
        missingShifts[5].length !== 0 ||
        missingShifts[6].length !== 0
      )) {
      return false;
    }


    return {
      "ingevuldeOperatorShiften": totaalShiften,
      "combinaties": returnValue
    }

  }

}