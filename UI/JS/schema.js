const SCHEMA = {
    PHOTOPOST:  {
      ID: {
        NAME: 'id',
        TYPE: 'string'
      },
      DESCRIPTION: {
        NAME: 'description',
        TYPE: 'string'
      },
      CREATEDAT: {
        NAME: 'createdAt',
        TYPE: 'object'
      },
      AUTHOR: {
        NAME: 'author',
        TYPE: 'string'
      },
      PHOTOLINK: {
        NAME: 'photoLink',
        TYPE: 'string'
      },
      HASHTAGS: {
        NAME: 'hashtags',
        TYPE: 'object'
      },
      LIKES: {
        NAME: 'likes',
        TYPE: 'object'
      }
    },
    FIELDS_VALID_TO_FILTER: ['createdAt', 'author', 'hashtags'],
    FIELDS_VALID_TO_UPDATE: ['description', 'photoLink', 'hashtags'],
  }

  window.SCHEMA = SCHEMA;