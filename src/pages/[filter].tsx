import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType
} from 'next';
import { i18n } from 'next-i18next.config';
import Head from 'next/head';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import { InfoFooter } from '../components/footer';
import { ssgInit } from '../server/ssg-init';
import { trpc } from '../utils/trpc';


type PageProps = InferGetStaticPropsType<typeof getStaticProps>;
export default function TodosPage(props: PageProps) {
  /*
   * This data will be hydrated from the `prefetch` in `getStaticProps`. This means that the page
   * will be rendered with the data from the server and there'll be no client loading state 👍
   */
  const allTasks = trpc.todo.all.useQuery(undefined, {
    staleTime: 3000,
  });

  return (
    <>
      <Head>
        <title>Todos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul>
        {allTasks.data?.map((task) => (
          <li key={task.id}>
          </li>
        ))}
      </ul>

      <InfoFooter locales={props.locales} filter={props.filter} />
    </>
  );
}

const filters = ['all', 'active', 'completed'] as const;
export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * Warning: This can be very heavy if you have a lot of locales
   * @see https://nextjs.org/docs/advanced-features/i18n-routing#dynamic-routes-and-getstaticprops-pages
   */
  const paths = filters.flatMap((filter) =>
    i18n.locales.map((locale) => ({ params: { filter }, locale })),
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const ssg = await ssgInit(context);

  await ssg.todo.all.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
      filter: (context.params?.filter as string) ?? 'all',
      locale: context.locale ?? context.defaultLocale,
      locales: context.locales ?? ['sv', 'en'],
    },
    revalidate: 1,
  };
};
