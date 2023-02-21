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
      of: [{type: 'block'}],
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
      description: 'The icon to use for this article. See https://ionicons.com for a list of available icons.',
    }
  ],
}
