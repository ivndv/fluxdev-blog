import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { defaultLang, ui } from "../i18n/ui";

export async function GET(context) {
	const posts = await getCollection("blog");
	const allPosts = posts.sort(
		(a, b) =>
			new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
	);

	return rss({
		title: "Flux Blog",
		description: ui[defaultLang]["home.welcome"],
		site: context.site,
		items: allPosts.map((post) => ({
			title: post.data.title,
			pubDate: new Date(post.data.date),
			description: post.data.description,
			link: post.id.startsWith("en/")
				? `/en/blog/${post.id.replace("en/", "")}`
				: `/blog/${post.id}`,
		})),
		customData: `<language>${defaultLang}</language>`,
	});
}
