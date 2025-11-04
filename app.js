let [fetchData, $, repoContent, membersContent] = [
    path => fetch(`https://api.github.com/orgs/you-apps/${path}`).then(res => res.json()),
    (tag, props = {}, ...children) => {
        const el = document.createElement(tag);
        
        for (const key in props)
            el[key] = props[key];
        
        el.append(...children);
        return el;
    },
'', ''];

Promise
    .all([fetchData('repos'), fetchData('members')])
    .then(([repos, members]) => {

        repoContent = repos
            .filter(repo => repo.name.endsWith("You") && !repo.archived)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .map(repo => 
                $('a', { className: 'card', href: repo.html_url }, 
                    $('img', { 
                        alt: `${repo.name} icon`,
                        src: `https://raw.githubusercontent.com/you-apps/${repo.name}/main/fastlane/metadata/android/en-US/images/icon.png`
                    }), 
                    $('div', {}, 
                        $('h3', { textContent: repo.name }),
                        $('p', { textContent: repo.description })
                    ),
                    $('span', { className: 'stars' }, 
                        $('img', { src: 'assets/star.svg', alt: 'Star icon' }), 
                        document.createTextNode(` ${repo.stargazers_count}`)
                    )
                )
            );
        
        membersContent = members
            .map(member => 
                $('a', { className: 'card', href: member.html_url }, 
                    $('img', { 
                        src: member.avatar_url, 
                        alt: `${member.login}'s avatar` 
                    }), 
                    $('h3', { textContent: member.login })
                )
            );
    })
    .catch(error => {
        console.error("Error loading data:", error);
        repoContent = [$('p', { textContent: "Failed to load apps. Please check the network connection." })];
        membersContent = [$('p', { textContent: "Failed to load team members. Please check the network connection." })];
    })
    .finally(() => {
        document.querySelector("#apps > div").replaceChildren(...repoContent);
        document.querySelector("#team > div").replaceChildren(...membersContent);
    });
