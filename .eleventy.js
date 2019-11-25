require("dotenv").config();

module.exports = eleventyConfig => {
  // eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  // // Get the first `n` elements of a collection.
  // eleventyConfig.addFilter('head', (array, n) => {
  //   if ( n < 0 ) {
  //     return array.slice(n);
  //   }

  //   return array.slice(0, n);
  // });

  eleventyConfig.addFilter('widont', string => {
    return string.split(" ").length > 2 ? string.replace(/\s([^\s<]+)\s*$/,'&nbsp;$1') : string
  });

  // eleventyConfig.addCollection('tagList', require('./_11ty/get-tag-list'));

  eleventyConfig.addPassthroughCopy('img');
  eleventyConfig.addPassthroughCopy('css');

  // /* Markdown Plugins */
  // const markdownIt = require('markdown-it')({
  //   html: true,
  //   breaks: true,
  //   linkify: true,
  //   typographer: true
  // });

  // eleventyConfig.setLibrary('md', markdownIt
  //   .use(markdownItAnchor, opts)
  // );

  return {
    templateFormats: [
      'md',
      'njk',
      'html',
      'liquid'
    ],

    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  };
};
