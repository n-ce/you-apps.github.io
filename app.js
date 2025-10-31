let [fetchData, repoContent, membersContent] = [
  path => fetch(`https://api.github.com/orgs/you-apps/${path}`).then(res => res.json()),
  "", ""];

Promise
  .all([fetchData('repos'), fetchData('members')])
  .then(([repos, members]) => {
    repoContent = repos
      .filter(repo => repo.name.endsWith("You") && !repo.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .map(repo => `
          <a class="card" href="${repo.html_url}">
            <img alt="${repo.name} icon"
              src="https://raw.githubusercontent.com/you-apps/${repo.name}/main/fastlane/metadata/android/en-US/images/icon.png">
            <div>
              <h3>${repo.name}</h3>
              <p>${repo.description}</p>
            </div>
            <span class="stars">
              <img src="assets/star.svg" alt="Star icon">
              ${repo.stargazers_count}
            </span>
          </a>
        `)
      .join('');

    membersContent = members
      .map(member => `
          <a class="card" href="${member.html_url}">
            <img src="${member.avatar_url}" alt="${member.login}'s avatar">
            <h3>${member.login}</h3>
          </a>
        `)
      .join('');
  })
  .catch(error => {
    console.error("Error loading data:", error);
    repoContent = "<p>Failed to load apps. Please check the network connection.</p>";
    membersContent = "<p>Failed to load team members. Please check the network connection.</p>";
  })
  .finally(() => {
    document.querySelector("#apps > div").innerHTML = repoContent;
    document.querySelector("#team > div").innerHTML = membersContent;
  });
