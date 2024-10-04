export function getKey(...args:string[]) {
    return `myapp:${args.join(':')}`;
}

export const userKeyById = (id:string) => getKey('user', id);

export const reviewKeyById = (id:string) => getKey('reviews', id);

export const reviewDetailsKeyById = (id:string) => getKey('review_details', id);

export const skillsSetKey = () => getKey('skills');

export const usersBySkillKey = (skill:string) => getKey('skills', skill);

export const skillsByUserKey = (id:string) => getKey('user_skills', id);

export const usersByRatingKey = () => getKey('by_rating');

export const fakeUsersKey = (id:string) => getKey('fake_users', id);

export const fakePostsKey = (id:string) => getKey('fake_posts', id);