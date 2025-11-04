const fetchData = path => fetch(`https://api.github.com/orgs/you-apps/${path}`).then(res => res.json());

Promise
    .all([fetchData('repos'), fetchData('members')])
    .then(([repos, members]) => {

        document.querySelector("#apps > div").replaceChildren(...repos
            .filter(repo => repo.name.endsWith("You") && !repo.archived)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .map(repo => {
                const card = document.createElement('a');
                card.className = 'card';
                card.href = repo.html_url;

                const img = document.createElement('img');
                img.alt = `${repo.name} icon`;
                img.src = `https://raw.githubusercontent.com/you-apps/${repo.name}/main/fastlane/metadata/android/en-US/images/icon.png`;
                
                const div = document.createElement('div');
                
                const h3 = document.createElement('h3');
                h3.textContent = repo.name;
                
                const p = document.createElement('p');
                p.textContent = repo.description;

                div.append(h3, p);

                const span = document.createElement('span');
                span.className = 'stars';
                
                const starImg = document.createElement('img');
                starImg.src = 'assets/star.svg';
                starImg.alt = 'Star icon';
                
                span.append(starImg, document.createTextNode(` ${repo.stargazers_count}`));

                card.append(img, div, span);
                return card;
            })
        );
        
        document.querySelector("#team > div").replaceChildren(...members
            .map(member => {
                const card = document.createElement('a');
                card.className = 'card';
                card.href = member.html_url;

                const img = document.createElement('img');
                img.src = member.avatar_url;
                img.alt = `${member.login}'s avatar`;

                const h3 = document.createElement('h3');
                h3.textContent = member.login;
                
                card.append(img, h3);
                return card;
            })
        );
    })
    .catch(() => {
        document.querySelector("#apps > div").textContent = "Failed to load apps.";
        document.querySelector("#team > div").textContent = "Failed to load team members.";
    });
