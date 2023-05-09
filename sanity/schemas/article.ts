export default {
  name: 'article',
  type: 'document',
  title: 'Article',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'content',
      type: 'array',
      of: [{type: 'block'}, {type: 'image'}],
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      readOnly: false,
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
    },
    {
      name: 'icon',
      type: 'string',
      title: 'Icon',
      description:
        'The icon to use for this article. See https://fontawesome.com/search?o=r&m=free for a list of the available icons.',
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Before arriving', value: 'before'},
          {title: 'After arriving', value: 'after'},
        ],
      },
    },
  ],
}
