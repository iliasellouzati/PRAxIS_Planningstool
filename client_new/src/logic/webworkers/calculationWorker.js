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
    const missingShiftsWeek = message.data[1].missingShiftsWeek[0];
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
      let weekId1 = IDS[0].possibleWeeks[index1];
      let filterTillEmployee1 = incompatibelWeeks[`${weekId1}`];
      filterTillEmployee1.push(weekId1);
      filterTillEmployee1 = [...new Set(filterTillEmployee1)].sort(function (a, b) {
        return a - b;
      });
      //  -----------------------------------------loop2----------------------------------------------------------------------------
      for (let index2 = 0; index2 < IDS[1].possibleWeeks.filter(x => !filterTillEmployee1.includes(x)).length; index2+=1
      
      ) {

        let weekId2 = IDS[1].possibleWeeks.filter(x => !filterTillEmployee1.includes(x))[index2];
        let filterTillEmployee2 = [...filterTillEmployee1, weekId2, ...incompatibelWeeks[`${weekId2}`]];
        filterTillEmployee2 = [...new Set(filterTillEmployee2)].sort(function (a, b) {
          return a - b;
        });;


        // -----------------------------------------loop3----------------------------------------------------------------------------
        for (let index3 = 0; index3 < IDS[2].possibleWeeks.filter(x => !filterTillEmployee2.includes(x)).length; index3+=1) {

          let weekId3 = IDS[2].possibleWeeks.filter(x => !filterTillEmployee2.includes(x))[index3];

          let filterTillEmployee3 = [...filterTillEmployee2, weekId3, ...incompatibelWeeks[`${weekId3}`]];
          filterTillEmployee3 = [...new Set(filterTillEmployee3)].sort(function (a, b) {
            return a - b;
          });;

          if (employeesSize > 3) {
            //  -----------------------------------------loop4---------------------------------------------------------------------------
            for (let index4 = 0; index4 < IDS[3].possibleWeeks.filter(x => !filterTillEmployee3.includes(x)).length; index4+=1) {

              let weekId4 = IDS[3].possibleWeeks.filter(x => !filterTillEmployee3.includes(x))[index4];
              if (employeesSize > 4) {

                let filterTillEmployee4 = [...filterTillEmployee3, weekId4, ...incompatibelWeeks[`${weekId4}`]];
                filterTillEmployee4 = [...new Set(filterTillEmployee4)].sort(function (a, b) {
                  return a - b;
                });;

                //-----------------------------------------loop5---------------------------------------------------------------------------
                for (let index5 = 0; index5 < IDS[4].possibleWeeks.filter(x => !filterTillEmployee4.includes(x)).length; index5+=1) {
                  let weekId5 = IDS[4].possibleWeeks.filter(x => !filterTillEmployee4.includes(x))[index5];
                  if (employeesSize > 5) {

                    let filterTillEmployee5 = [...filterTillEmployee4, weekId5, ...incompatibelWeeks[`${weekId5}`]];
                    filterTillEmployee5 = [...new Set(filterTillEmployee5)].sort(function (a, b) {
                      return a - b;
                    });;


                    //-----------------------------------------loop6---------------------------------------------------------------------------
                    for (let index6 = 0; index6 < IDS[5].possibleWeeks.filter(x => !filterTillEmployee5.includes(x)).length; index6+=1) {
                      let weekId6 = IDS[5].possibleWeeks.filter(x => !filterTillEmployee5.includes(x))[index6];
                      if (employeesSize > 6) {

                        let filterTillEmployee6 = [...filterTillEmployee5, weekId6, ...incompatibelWeeks[`${weekId6}`]];
                        filterTillEmployee6 = [...new Set(filterTillEmployee6)].sort(function (a, b) {
                          return a - b;
                        });;


                        //-----------------------------------------loop7---------------------------------------------------------------------------
                        for (let index7 = 0; index7 < IDS[6].possibleWeeks.filter(x => !filterTillEmployee6.includes(x)).length; index7+=1) {
                          let weekId7 = IDS[6].possibleWeeks.filter(x => !filterTillEmployee6.includes(x))[index7];
                          if (employeesSize > 7) {

                            let filterTillEmployee7 = [...filterTillEmployee6, weekId7, ...incompatibelWeeks[`${weekId7}`]];
                            filterTillEmployee7 = [...new Set(filterTillEmployee7)].sort(function (a, b) {
                              return a - b;
                            });;


                            //-----------------------------------------loop8--------------------------------------------------------------------------
                            for (let index8 = 0; index8 < IDS[7].possibleWeeks.filter(x => !filterTillEmployee7.includes(x)).length; index8+=1) {
                              let weekId8 = IDS[7].possibleWeeks.filter(x => !filterTillEmployee7.includes(x))[index8];
                              if (employeesSize > 8) {

                                let filterTillEmployee8 = [...filterTillEmployee7, weekId8, ...incompatibelWeeks[`${weekId8}`]];
                                filterTillEmployee8 = [...new Set(filterTillEmployee8)].sort(function (a, b) {
                                  return a - b;
                                });;


                                //-----------------------------------------loop9--------------------------------------------------------------------------
                                for (let index9 = 0; index9 < IDS[8].possibleWeeks.filter(x => !filterTillEmployee8.includes(x)).length; index9+=1) {
                                  let weekId9 = IDS[8].possibleWeeks.filter(x => !filterTillEmployee8.includes(x))[index9];
                                  if (employeesSize > 9) {

                                    let filterTillEmployee9 = [...filterTillEmployee8, weekId9, ...incompatibelWeeks[`${weekId9}`]];
                                    filterTillEmployee9 = [...new Set(filterTillEmployee9)].sort(function (a, b) {
                                      return a - b;
                                    });;


                                    //-----------------------------------------loop10--------------------------------------------------------------------------
                                    for (let index10 = 0; index10 < IDS[9].possibleWeeks.filter(x => !filterTillEmployee9.includes(x)).length; index10+=2) {
                                      let weekId10 = IDS[9].possibleWeeks.filter(x => !filterTillEmployee9.includes(x))[index10];
                                      if (employeesSize > 10) {

                                        let filterTillEmployee10 = [...filterTillEmployee9, weekId10, ...incompatibelWeeks[`${weekId10}`]];
                                        filterTillEmployee10 = [...new Set(filterTillEmployee10)].sort(function (a, b) {
                                          return a - b;
                                        });;


                                        //-----------------------------------------loop11--------------------------------------------------------------------------
                                        for (let index11 = 0; index11 < IDS[10].possibleWeeks.filter(x => !filterTillEmployee10.includes(x)).length; index11+=2) {
                                          let weekId11 = IDS[10].possibleWeeks.filter(x => !filterTillEmployee10.includes(x))[index11];
                                          if (employeesSize > 11) {

                                            let filterTillEmployee11 = [...filterTillEmployee10, weekId11, ...incompatibelWeeks[`${weekId11}`]];
                                            filterTillEmployee11 = [...new Set(filterTillEmployee11)].sort(function (a, b) {
                                              return a - b;
                                            });;


                                            //-----------------------------------------loop12--------------------------------------------------------------------------
                                            for (let index12 = 0; index12 < IDS[11].possibleWeeks.filter(x => !filterTillEmployee11.includes(x)).length; index12+=2) {
                                              let weekId12 = IDS[11].possibleWeeks.filter(x => !filterTillEmployee11.includes(x))[index12];
                                              if (employeesSize > 12) {

                                                let filterTillEmployee12 = [...filterTillEmployee11, weekId12, ...incompatibelWeeks[`${weekId12}`]];
                                                filterTillEmployee12 = [...new Set(filterTillEmployee12)].sort(function (a, b) {
                                                  return a - b;
                                                });;


                                                //-----------------------------------------loop13--------------------------------------------------------------------------
                                                for (let index13 = 0; index13 < IDS[12].possibleWeeks.filter(x => !filterTillEmployee12.includes(x)).length; index13+=2) {
                                                  let weekId13 = IDS[12].possibleWeeks.filter(x => !filterTillEmployee12.includes(x))[index13];
                                                  if (employeesSize > 13) {

                                                    let filterTillEmployee13 = [...filterTillEmployee12, weekId13, ...incompatibelWeeks[`${weekId13}`]];
                                                    filterTillEmployee13 = [...new Set(filterTillEmployee13)].sort(function (a, b) {
                                                      return a - b;
                                                    });;


                                                    //-----------------------------------------loop14--------------------------------------------------------------------------
                                                    for (let index14 = 0; index14 < IDS[13].possibleWeeks.filter(x => !filterTillEmployee13.includes(x)).length; index14+=2) {
                                                      let weekId14 = IDS[13].possibleWeeks.filter(x => !filterTillEmployee13.includes(x))[index14];
                                                      if (employeesSize > 14) {

                                                        let filterTillEmployee14 = [...filterTillEmployee13, weekId14, ...incompatibelWeeks[`${weekId14}`]];
                                                        filterTillEmployee14 = [...new Set(filterTillEmployee14)].sort(function (a, b) {
                                                          return a - b;
                                                        });;


                                                        //-----------------------------------------loop15--------------------------------------------------------------------------
                                                        for (let index15 = 0; index15 < IDS[14].possibleWeeks.filter(x => !filterTillEmployee14.includes(x)).length; index15+=2) {
                                                          let weekId15 = IDS[14].possibleWeeks.filter(x => !filterTillEmployee14.includes(x))[index15];
                                                          let respons = berekenEindeLoop({
                                                            'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7, weekId8, weekId9, weekId10, weekId11, weekId12, weekId13, weekId14, weekId15],
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
                                                          mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                                                            } else {
                                                              let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                              mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                                            }
                                                          }

                                                          //end loop15
                                                        }
                                                      } else {
                                                        let respons = berekenEindeLoop({
                                                          'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7, weekId8, weekId9, weekId10, weekId11, weekId12, weekId13, weekId14],
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
                                                        mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                                                          } else {
                                                            let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                            mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                                          }
                                                        }

                                                      }
                                                      //end loop14
                                                    }
                                                  } else {
                                                    let respons = berekenEindeLoop({
                                                      'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7, weekId8, weekId9, weekId10, weekId11, weekId12, weekId13],
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
                                                    mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                                                      } else {
                                                        let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                        mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                                      }
                                                    }
                                                  }
                                                  //end loop13
                                                }
                                              } else {
                                                let respons = berekenEindeLoop({
                                                  'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7, weekId8, weekId9, weekId10, weekId11, weekId12],
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
                                                mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                                                  } else {
                                                    let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                    mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                                  }
                                                }
                                              }
                                              //end loop12
                                            }
                                          } else {
                                            let respons = berekenEindeLoop({
                                              'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7, weekId8, weekId9, weekId10, weekId11],
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
                                            mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                                              } else {
                                                let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                                mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                              }
                                            }
                                          }
                                          //end loop11
                                        }
                                      } else {
                                        let respons = berekenEindeLoop({
                                          'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7, weekId8, weekId9, weekId10],
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
                                        mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                                          } else {
                                            let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                            mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                          }
                                        }
                                      }
                                      //end loop10
                                    }
                                  } else {
                                    let respons = berekenEindeLoop({
                                      'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7, weekId8, weekId9],
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
                                    mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                                      } else {
                                        let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                        mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                      }

                                      // console.log(`INDEX: ${index1} - ${index2} - ${index3} - ${index4} - ${index5} - ${index6} - ${index7} - ${index8} - ${index9}`);

                                    }
                                  }
                                  //end loop9
                                }
                              } else {
                                let respons = berekenEindeLoop({
                                  'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7, weekId8],
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
                                mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                                  } else {
                                    let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                    mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                                  }
                                  index4 = 1000;
                                  index6 = 1000;
                                  index7 = 1000;
                                  index8 = 1000;
                                  index5 = 1000;
                                }



                              }
                              //end loop8
                            }
                          } else {
                            let respons = berekenEindeLoop({
                              'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6, weekId7],
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
                            mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                              } else {
                                let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                                mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                              }
                              index4 = 1000;
                              index5 = 1000;
                              index6 = 1000;
                              index7 = 1000;
                            }



                          }
                          //end loop7   
                        }
                      } else {
                        let respons = berekenEindeLoop({
                          'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5, weekId6],
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
                        mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                          } else {
                            let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                            mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                          }
                          index4 = 1000;
                          index5 = 1000;
                          index6 = 1000;
                        }

                      }
                      //end loop6
                    }
                  } else {
                    let respons = berekenEindeLoop({
                      'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4, weekId5],
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
                    mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                      } else {
                        let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                        mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                      }
                      index4 = 1000;
                      index5 = 1000;
                    }

                  }
                  //end loop5
                }
              } else {
                let respons = berekenEindeLoop({
                  'arrayWeekIdCombo': [weekId1, weekId2, weekId3, weekId4],
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
                mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })                  } else {
                    let hulpIndex = mogelijkeCombinaties.findIndex(x => x.ingevuldeOperatorShiften === respons.ingevuldeOperatorShiften);
                    mogelijkeCombinaties[hulpIndex].combinaties.push(respons.combinaties)
                  }

                  index4 = 1000;
                }

              }
              //end loop4 
            }
          } else {
            let respons = berekenEindeLoop({
              'arrayWeekIdCombo': [weekId1, weekId2, weekId3],
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
                mogelijkeCombinaties.push({
                  'ingevuldeOperatorShiften':respons.ingevuldeOperatorShiften,
                  'combinaties':[respons.combinaties]
                })
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


    let returnValue = [];
    let totaalShiften = 0;
    let missingShifts = [...missingShiftsWeek]
    let debugValue = [];

    arrayWeekIdCombo.forEach((weekId, index) => {
      let week = weeklyStructures.find(x => x.id === weekId);


      if (week.maandag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[0] = missingShifts[0].filter(x => x !== parseInt(week.maandag));
        }
      }
      if (week.dinsdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[1] = missingShifts[1].filter(x => x !== parseInt(week.dinsdag));
        }
      }
      if (week.woensdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[2] = missingShifts[2].filter(x => x !== parseInt(week.woensdag));
        }
      }
      if (week.donderdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[3] = missingShifts[3].filter(x => x !== parseInt(week.donderdag));
        }
      }
      if (week.vrijdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[4] = missingShifts[4].filter(x => x !== parseInt(week.vrijdag));
        }
      }
      if (week.zaterdag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[5] = missingShifts[5].filter(x => x !==parseInt( week.zaterdag));
        }
      }
      if (week.zondag !== '') {
        totaalShiften++;
        if (filters.some(x => x === "NACHT_WEEKEND_GEVULD")) {
          missingShifts[6] = missingShifts[6].filter(x => x !== parseInt(week.zondag));
        }
      }

      returnValue.push({
        'empId': employeeIDS[index],
        'weekId': weekId
      })

      debugValue.push([
        `id:${employeeIDS[index]}`,
        week.maandag === '' ? '    ' : week.maandag,
        week.dinsdag === '' ? '    ' : week.dinsdag,
        week.woensdag === '' ? '    ' : week.woensdag,
        week.donderdag === '' ? '    ' : week.donderdag,
        week.vrijdag === '' ? '    ' : week.vrijdag,
        week.zaterdag === '' ? '    ' : week.zaterdag,
        week.zondag === '' ? '    ' : week.zondag
      ]);

    });

    if (filters.some(x => x === "NACHT_WEEKEND_GEVULD") && (

        missingShifts[0].some(x => x == 5 || x == 7) ||
        missingShifts[1].some(x => x == 5 || x == 7) ||
        missingShifts[2].some(x => x == 5 || x == 7) ||
        missingShifts[3].some(x => x == 5 || x == 7) ||
        missingShifts[4].some(x => x == 5 || x == 7) ||
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