const simpleQueryObject = {
  query: {
    "@id": "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf",
    name: "SMI Population",
    description: "Adults 18+ with SMI",
    from: {
      "@id": "http://endhealth.info/im#Q_RegisteredGMS",
      name: "Registered with GP for GMS services on the reference date"
    }
  },
  queryUI: {
    key: 0,
    label: "query",
    type: "org.endeavourhealth.imapi.model.iml.Query",
    children: [
      {
        key: 1,
        label: "iri",
        type: "java.lang.String",
        value: "urn:uuid:6d517466-813b-46a8-b848-aaf5a4fbdcbf"
      },
      {
        key: 2,
        label: "name",
        type: "java.lang.String",
        value: "SMI Population"
      },
      {
        key: 3,
        label: "description",
        type: "java.lang.String",
        value: "Adults 18+ with SMI"
      },
      {
        key: 4,
        label: "from",
        type: "org.endeavourhealth.imapi.model.iml.From",
        children: [
          {
            key: 5,
            label: "Registered with GP for GMS services on the reference date",
            type: "org.endeavourhealth.imapi.model.tripletree.TTIriRef",
            value: {
              "@id": "http://endhealth.info/im#Q_RegisteredGMS",
              name: "Registered with GP for GMS services on the reference date"
            }
          }
        ]
      }
    ]
  }
};

export { simpleQueryObject };
