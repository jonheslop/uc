const fetch = require('node-fetch');

// see https://www.datocms.com/docs/content-delivery-api/first-request#vanilla-js-example
async function getAllProjects() {
  const recordsPerQuery = 100;
  let recordsToSkip = 0;
  let makeNewQuery = true;
  let projects = [];

  while (makeNewQuery) {
    try {
      const dato = await fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.DATOCMS_TOKEN}`
        },
        body: JSON.stringify({
          query: `{
            allProjects(
              first: ${recordsPerQuery},
              skip: ${recordsToSkip},
              orderBy: _createdAt_DESC,
              filter: {
                _status: {eq: published}
              }
            )
            {
              id
              slug
              title
              description(markdown: true)
              seo {
                description
                image {
                  url
                  format
                  alt
                  height
                  title
                  width
                }
                title
                twitterCard
              }
              blocks {
                id
                layout
                image {
                  alt
                  customData
                  format
                  height
                  title
                  url
                  width
                }
              }
              _createdAt
            }
          }`
        })
      });

      const response = await dato.json();

      // handle DatoCMS errors
      if (response.errors) {
        let errors = response.errors;
        errors.map(error => {
          console.log(error.message);
        });
        throw new Error('Aborting: DatoCMS errors');
      }

      projects = projects.concat(response.data.allProjects);
      recordsToSkip += recordsPerQuery;

      if (response.data.allProjects.length < recordsPerQuery) {
        makeNewQuery = false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  const projectsFormatted = projects.map(project => {
    return {
      id: project.id,
      date: project._createdAt,
      title: project.title,
      slug: project.slug,
      description: project.description,
      blocks: project.blocks,
      seo: project.seo
    };
  });

  return projectsFormatted;
}

module.exports = getAllProjects;
