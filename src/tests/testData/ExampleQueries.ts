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

const Aged70to74 = {
  "@id": "urn:uuid:da496f54-dca5-4df7-8ffc-98c671d054b9",
  name: "04a Aged 70-74",
  description: "All those 70 years of age and over",
  from: [{ "@id": "http://endhealth.info/im#Q_RegisteredGMS", name: "Registered with GP for GMS services on the reference date", isSet: true }],
  where: { and: [{ from: [{ "@id": "urn:uuid:e0dadef9-b429-48f7-b69f-faa39d103673", name: "Aged 70-74", isSet: true }] }] }
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

const simpleListSetQuery = {
  where: {
    from: [
      {
        "@id": "http://snomed.info/sct#1240451000000106",
        includeSubtypes: true
      },
      {
        "@id": "http://snomed.info/sct#1240711000000104",
        includeSubtypes: true
      }
    ]
  }
};

const simpleListWithExclusionsSetQuery = {
  where: {
    from: [
      {
        "@id": "http://snomed.info/sct#387713003",
        includeSubtypes: true
      },
      {
        "@id": "http://snomed.info/sct#86273004",
        includeSubtypes: true
      }
    ],
    notExist: {
      from: [
        {
          "@id": "http://snomed.info/sct#363244004",
          includeSubtypes: true
        }
      ]
    }
  }
};

const refinedConceptsSetQuery = {
  where: {
    from: [
      {
        "@id": "http://snomed.info/sct#763158003",
        includeSubtypes: true
      }
    ],
    path: "http://endhealth.info/im#roleGroup",
    and: [
      {
        property: {
          "@id": "http://snomed.info/sct#127489000",
          includeSubtypes: true
        },
        is: {
          "@id": "http://snomed.info/sct#372665008",
          includeSubtypes: true
        }
      },
      {
        property: {
          "@id": "http://snomed.info/sct#411116001",
          includeSubtypes: true
        },
        is: {
          "@id": "http://snomed.info/sct#385268001",
          includeSubtypes: true
        }
      }
    ]
  }
};
export { AsthmaSubTypesCore, PainInLowerLimbORChestPainMinus, Aged70to74, simpleListSetQuery, simpleListWithExclusionsSetQuery, refinedConceptsSetQuery };
