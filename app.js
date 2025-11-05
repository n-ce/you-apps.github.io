const $ = (tag, props = {}, ...children) => {
    const el = document.createElement(tag);
    Object.assign(el, props);

    children.forEach(child => el.append(
        Array.isArray(child) 
            ? $(child[0], child[1], ...child.slice(2)) 
            : (child instanceof Node ? child : String(child))
    ));

    return el;
};

const fetchData = path => fetch(`https://api.github.com/orgs/you-apps/${path}`).then(res => res.json());

Promise.all([fetchData('repos'), fetchData('members')])
    .then(([repos, members]) => {
        document.querySelector("#apps > div").replaceChildren(...repos
            .filter(repo => repo.name.endsWith("You") && !repo.archived)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .map(({ name, html_url, description, stargazers_count }) => 
                $('a', { className: 'card', href: html_url },
                    ['img', {
                        alt: `${name} icon`,
                        src: `https://raw.githubusercontent.com/you-apps/${name}/main/fastlane/metadata/android/en-US/images/icon.png`
                    }],
                    ['div', {},
                        ['h3', { textContent: name }],
                        ['p', { textContent: description }]
                    ],
                    ['span', { className: 'stars' },
                        ['img', { src: 'assets/star.svg', alt: 'Star icon' }],
                        ` ${stargazers_count}`
                    ]
                )
            )
        );
        
        document.querySelector("#team > div").replaceChildren(...members
            .map(({ login, html_url, avatar_url }) => 
                $('a', { className: 'card', href: html_url },
                    ['img', { src: avatar_url, alt: `${login}'s avatar` }],
                    ['h3', { textContent: login }]
                )
            )
        );
    })
    .catch(() => {
        document.querySelector("#apps > div").textContent = "Failed to load apps.";
        document.querySelector("#team > div").textContent = "Failed to load team members.";
    });
