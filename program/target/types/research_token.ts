export type ResearchToken = {
  "version": "0.1.0",
  "name": "research_token",
  "instructions": [
    {
      "name": "initializeResearch",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "authors",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "doi",
          "type": "string"
        },
        {
          "name": "impactScore",
          "type": "f64"
        },
        {
          "name": "fundingGoal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "fundResearch",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintTokens",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateResearchStatus",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "researchAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "authors",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "doi",
            "type": "string"
          },
          {
            "name": "impactScore",
            "type": "f64"
          },
          {
            "name": "tokenSupply",
            "type": "u64"
          },
          {
            "name": "fundingGoal",
            "type": "u64"
          },
          {
            "name": "currentFunding",
            "type": "u64"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotActive",
      "msg": "Research is not active"
    },
    {
      "code": 6001,
      "name": "Overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6002,
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    }
  ]
};

export const IDL: ResearchToken = {
  "version": "0.1.0",
  "name": "research_token",
  "instructions": [
    {
      "name": "initializeResearch",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "authors",
          "type": {
            "vec": "string"
          }
        },
        {
          "name": "doi",
          "type": "string"
        },
        {
          "name": "impactScore",
          "type": "f64"
        },
        {
          "name": "fundingGoal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "fundResearch",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "funder",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintTokens",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateResearchStatus",
      "accounts": [
        {
          "name": "research",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "isActive",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "researchAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "authors",
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "doi",
            "type": "string"
          },
          {
            "name": "impactScore",
            "type": "f64"
          },
          {
            "name": "tokenSupply",
            "type": "u64"
          },
          {
            "name": "fundingGoal",
            "type": "u64"
          },
          {
            "name": "currentFunding",
            "type": "u64"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotActive",
      "msg": "Research is not active"
    },
    {
      "code": 6001,
      "name": "Overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6002,
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    }
  ]
};
