declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"article": {
"csharp-in-unity-is-great.md": {
	id: "csharp-in-unity-is-great.md";
  slug: "csharp-in-unity-is-great";
  body: string;
  collection: "article";
  data: any
} & { render(): Render[".md"] };
"lets-go-for-it.md": {
	id: "lets-go-for-it.md";
  slug: "lets-go-for-it";
  body: string;
  collection: "article";
  data: any
} & { render(): Render[".md"] };
"new-section-challenges.md": {
	id: "new-section-challenges.md";
  slug: "new-section-challenges";
  body: string;
  collection: "article";
  data: any
} & { render(): Render[".md"] };
"no-more-cookies.md": {
	id: "no-more-cookies.md";
  slug: "no-more-cookies";
  body: string;
  collection: "article";
  data: any
} & { render(): Render[".md"] };
"revamped-game-callet.md": {
	id: "revamped-game-callet.md";
  slug: "revamped-game-callet";
  body: string;
  collection: "article";
  data: any
} & { render(): Render[".md"] };
};
"career": {
"coosto.mdx": {
	id: "coosto.mdx";
  slug: "coosto";
  body: string;
  collection: "career";
  data: any
} & { render(): Render[".mdx"] };
"freelance-2015.mdx": {
	id: "freelance-2015.mdx";
  slug: "freelance-2015";
  body: string;
  collection: "career";
  data: any
} & { render(): Render[".mdx"] };
"freelance-2021.mdx": {
	id: "freelance-2021.mdx";
  slug: "freelance-2021";
  body: string;
  collection: "career";
  data: any
} & { render(): Render[".mdx"] };
"indra.mdx": {
	id: "indra.mdx";
  slug: "2012-indra";
  body: string;
  collection: "career";
  data: any
} & { render(): Render[".mdx"] };
"lucentia-lab.md": {
	id: "lucentia-lab.md";
  slug: "lucentia-lab";
  body: string;
  collection: "career";
  data: any
} & { render(): Render[".md"] };
"square1.md": {
	id: "square1.md";
  slug: "square1";
  body: string;
  collection: "career";
  data: any
} & { render(): Render[".md"] };
};
"challenge": {
"design-a-hashmap-without-using-any-built-in-libraries.mdx": {
	id: "design-a-hashmap-without-using-any-built-in-libraries.mdx";
  slug: "design-a-hashmap-without-using-any-built-in-libraries";
  body: string;
  collection: "challenge";
  data: any
} & { render(): Render[".mdx"] };
"given-an-n-x-n-array-rotate-it-90-degrees-without-making-a-new-array.mdx": {
	id: "given-an-n-x-n-array-rotate-it-90-degrees-without-making-a-new-array.mdx";
  slug: "given-an-n-x-n-array-rotate-it-90-degrees-without-making-a-new-array";
  body: string;
  collection: "challenge";
  data: any
} & { render(): Render[".mdx"] };
"remove-the-outdated-stocks-from-the-queue.mdx": {
	id: "remove-the-outdated-stocks-from-the-queue.mdx";
  slug: "remove-the-outdated-stocks-from-the-queue";
  body: string;
  collection: "challenge";
  data: any
} & { render(): Render[".mdx"] };
};
"database": {
"cassandra.md": {
	id: "cassandra.md";
  slug: "cassandra";
  body: string;
  collection: "database";
  data: any
} & { render(): Render[".md"] };
"elasticsearch.md": {
	id: "elasticsearch.md";
  slug: "elastic";
  body: string;
  collection: "database";
  data: any
} & { render(): Render[".md"] };
"mongodb.md": {
	id: "mongodb.md";
  slug: "mongodb";
  body: string;
  collection: "database";
  data: any
} & { render(): Render[".md"] };
"mysql.md": {
	id: "mysql.md";
  slug: "mysql";
  body: string;
  collection: "database";
  data: any
} & { render(): Render[".md"] };
"oracle.md": {
	id: "oracle.md";
  slug: "oracle";
  body: string;
  collection: "database";
  data: any
} & { render(): Render[".md"] };
"redis.md": {
	id: "redis.md";
  slug: "redis";
  body: string;
  collection: "database";
  data: any
} & { render(): Render[".md"] };
};
"development": {
"android.md": {
	id: "android.md";
  slug: "android";
  body: string;
  collection: "development";
  data: any
} & { render(): Render[".md"] };
"business-intelligence.md": {
	id: "business-intelligence.md";
  slug: "business-intelligence";
  body: string;
  collection: "development";
  data: any
} & { render(): Render[".md"] };
"game.md": {
	id: "game.md";
  slug: "game";
  body: string;
  collection: "development";
  data: any
} & { render(): Render[".md"] };
"ios.md": {
	id: "ios.md";
  slug: "ios";
  body: string;
  collection: "development";
  data: any
} & { render(): Render[".md"] };
"web.md": {
	id: "web.md";
  slug: "web";
  body: string;
  collection: "development";
  data: any
} & { render(): Render[".md"] };
};
"education": {
"university-alicante.md": {
	id: "university-alicante.md";
  slug: "university-alicante";
  body: string;
  collection: "education";
  data: any
} & { render(): Render[".md"] };
};
"framework": {
"angular-1.mdx": {
	id: "angular-1.mdx";
  slug: "angular-1";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".mdx"] };
"ionic.mdx": {
	id: "ionic.mdx";
  slug: "ionic";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".mdx"] };
"j2ee.md": {
	id: "j2ee.md";
  slug: "j2ee";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".md"] };
"laravel.md": {
	id: "laravel.md";
  slug: "laravel";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".md"] };
"nestjs.md": {
	id: "nestjs.md";
  slug: "nestjs";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".md"] };
"nuxt.md": {
	id: "nuxt.md";
  slug: "nuxt";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".md"] };
"react-native.md": {
	id: "react-native.md";
  slug: "react-native";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".md"] };
"react.md": {
	id: "react.md";
  slug: "react";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".md"] };
"sailsjs.md": {
	id: "sailsjs.md";
  slug: "sailsjs";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".md"] };
"unity.md": {
	id: "unity.md";
  slug: "unity";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".md"] };
"vue.mdx": {
	id: "vue.mdx";
  slug: "vue";
  body: string;
  collection: "framework";
  data: any
} & { render(): Render[".mdx"] };
};
"language": {
"c.mdx": {
	id: "c.mdx";
  slug: "c";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"cpp.mdx": {
	id: "cpp.mdx";
  slug: "cpp";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"csharp.mdx": {
	id: "csharp.mdx";
  slug: "c-sharp";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"golang.mdx": {
	id: "golang.mdx";
  slug: "golang";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"java.mdx": {
	id: "java.mdx";
  slug: "java";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"javascript.mdx": {
	id: "javascript.mdx";
  slug: "javascript";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"kotlin.mdx": {
	id: "kotlin.mdx";
  slug: "kotlin";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"php.mdx": {
	id: "php.mdx";
  slug: "php";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"rust.mdx": {
	id: "rust.mdx";
  slug: "rust";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"swift.mdx": {
	id: "swift.mdx";
  slug: "swift";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
"typescript.mdx": {
	id: "typescript.mdx";
  slug: "typescript";
  body: string;
  collection: "language";
  data: any
} & { render(): Render[".mdx"] };
};
"message-broker": {
"kafka.md": {
	id: "kafka.md";
  slug: "kafka";
  body: string;
  collection: "message-broker";
  data: any
} & { render(): Render[".md"] };
"rabbitmq.md": {
	id: "rabbitmq.md";
  slug: "rabbitmq";
  body: string;
  collection: "message-broker";
  data: any
} & { render(): Render[".md"] };
};
"page": {
"about-me.mdx": {
	id: "about-me.mdx";
  slug: "about-me";
  body: string;
  collection: "page";
  data: any
} & { render(): Render[".mdx"] };
"security-and-cookies.mdx": {
	id: "security-and-cookies.mdx";
  slug: "security-and-cookies";
  body: string;
  collection: "page";
  data: any
} & { render(): Render[".mdx"] };
};
"pages": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "pages";
  data: InferEntrySchema<"pages">;
  render(): Render[".md"];
}>;
"project": {
"angelaberenguer.md": {
	id: "angelaberenguer.md";
  slug: "angelaberenguer";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"avellana-colora.md": {
	id: "avellana-colora.md";
  slug: "avellana-colora";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"callet.md": {
	id: "callet.md";
  slug: "callet";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"catrisma.md": {
	id: "catrisma.md";
  slug: "catrisma";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"clockwork-heroes.md": {
	id: "clockwork-heroes.md";
  slug: "clockwork-heroes";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"codeserk.md": {
	id: "codeserk.md";
  slug: "codeserk";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"happy-food.md": {
	id: "happy-food.md";
  slug: "happy-food";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"i-ching.md": {
	id: "i-ching.md";
  slug: "i-ching";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"ivy.md": {
	id: "ivy.md";
  slug: "ivy";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"lucky-cactus.md": {
	id: "lucky-cactus.md";
  slug: "lucky-cactus";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"ludum-dare-25.md": {
	id: "ludum-dare-25.md";
  slug: "ludum-dare-25";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"ludum-dare-28.md": {
	id: "ludum-dare-28.md";
  slug: "ludum-dare-28";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"ludum-dare-35.md": {
	id: "ludum-dare-35.md";
  slug: "ludum-dare-35";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"meeting-point.md": {
	id: "meeting-point.md";
  slug: "meeting-point";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"moody.md": {
	id: "moody.md";
  slug: "moody";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"press.md": {
	id: "press.md";
  slug: "press";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"television.md": {
	id: "television.md";
  slug: "television";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"wakatime-unity.md": {
	id: "wakatime-unity.md";
  slug: "wakatime-unity";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
"walkaholic.md": {
	id: "walkaholic.md";
  slug: "walkaholic";
  body: string;
  collection: "project";
  data: any
} & { render(): Render[".md"] };
};
"technology": {
"docker.md": {
	id: "docker.md";
  slug: "docker";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"firebase.md": {
	id: "firebase.md";
  slug: "firebase";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"graphql.md": {
	id: "graphql.md";
  slug: "graphql";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"honeycomb.md": {
	id: "honeycomb.md";
  slug: "honeycomb";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"jaeger.md": {
	id: "jaeger.md";
  slug: "jaeger";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"jenkins.md": {
	id: "jenkins.md";
  slug: "jenkins";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"kubernetes.md": {
	id: "kubernetes.md";
  slug: "kubernetes";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"pentaho.md": {
	id: "pentaho.md";
  slug: "pentaho";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"phonegap.md": {
	id: "phonegap.md";
  slug: "phonegap";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"scss.md": {
	id: "scss.md";
  slug: "scss";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"sonarqube.md": {
	id: "sonarqube.md";
  slug: "sonarqube";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"websockets.md": {
	id: "websockets.md";
  slug: "websockets";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
"wordpress.md": {
	id: "wordpress.md";
  slug: "wordpress";
  body: string;
  collection: "technology";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../src/content/config.js");
}
