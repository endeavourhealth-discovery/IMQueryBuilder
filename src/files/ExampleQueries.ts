const allNodeShapesQuery = {
  query: {
    name: "A new query",
    description: "A new query built with the query-builder",
    select: {
      property: [
        {
          name: "label",
          "@id": "http://www.w3.org/2000/01/rdf-schema#label"
        }
      ],
      match: [
        {
          property: [
            {
              name: "type",
              "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
              isConcept: [
                {
                  "@id": "http://www.w3.org/ns/shacl#NodeShape"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  tree: [
    {
      key: "0",
      label: "query",
      children: [
        {
          key: "0-0",
          label: "name",
          data: { name: "A new query" }
        },
        {
          key: "0-1",
          label: "description",
          data: { description: "A new query built with the query-builder" }
        },
        {
          key: "0-2",
          label: "select",
          children: [
            {
              key: "0-2-0",
              label: "property",
              children: [
                {
                  key: "0-2-0-0",
                  label: "label",
                  data: {
                    name: "label"
                  }
                },
                {
                  key: "0-2-0-1",
                  label: "http://www.w3.org/2000/01/rdf-schema#label",
                  data: {
                    "@id": "http://www.w3.org/2000/01/rdf-schema#label"
                  }
                }
              ]
            },
            {
              key: "0-2-1",
              label: "match",
              children: [
                {
                  key: "0-2-1-0",
                  label: "property",
                  children: [
                    {
                      key: "0-2-1-0-0",
                      label: "type",
                      data: { name: "type" }
                    },
                    {
                      key: "0-2-1-0-1",
                      label: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
                      data: { "@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" }
                    },
                    {
                      key: "0-2-1-0-2",
                      label: "isConcept",
                      children: [
                        {
                          key: "0-2-1-0-1-0",
                          label: "http://www.w3.org/ns/shacl#NodeShape",
                          data: {
                            "@id": "http://www.w3.org/ns/shacl#NodeShape"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export { allNodeShapesQuery };
