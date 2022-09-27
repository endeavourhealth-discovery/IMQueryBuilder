const AsthmaSubTypesCore = {
  query: {
    name: "AsthmaSubTypesCore",
    from: [
      {
        "@id": "http://snomed.info/sct#195967001",
        includeSubtypes: true
      }
    ],
    select: [
      {
        property: {
          "@id": "http://www.w3.org/2000/01/rdf-schema#label"
        }
      },
      {
        property: {
          "@id": "http://endhealth.info/im#code"
        }
      }
    ],
    usePrefixes: true
  }
};

const PainInLowerLimbORChestPainMinus = {
  query: {
    name: "Pain in lower limb OR Chest pain minus (Chest wall pain or chest pain with sudden onset",
    where: {
      or: [
        {
          from: [
            {
              "@id": "http://snomed.info/sct#10601006",
              includeSubtypes: true
            }
          ]
        },
        {
          from: [
            {
              "@id": "http://snomed.info/sct#29857009",
              includeSubtypes: true
            }
          ],
          notExist: {
            or: [
              {
                from: [
                  {
                    "@id": "http://snomed.info/sct#102588006",
                    includeSubtypes: true
                  }
                ]
              },
              {
                from: [
                  {
                    "@id": "http://snomed.info/sct#29857009",
                    includeSubtypes: true
                  }
                ],
                path: "http://endhealth.info/im#roleGroup",
                where: {
                  property: {
                    "@id": "http://snomed.info/sct#263502005",
                    name: "Clinical course (attribute)"
                  },
                  is: {
                    "@id": "http://snomed.info/sct#424124008",
                    name: "Sudden onset AND/OR short duration (qualifier value)"
                  }
                }
              }
            ]
          }
        }
      ]
    },
    activeOnly: true
  }
};
export { AsthmaSubTypesCore, PainInLowerLimbORChestPainMinus };
