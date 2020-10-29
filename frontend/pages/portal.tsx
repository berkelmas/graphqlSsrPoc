import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import cookie from "cookie";
import { useQuery } from "@apollo/client";
import {
  IGetFake,
  IGetFakeVariables,
} from "../graphql/fake/queries/types/fake.types";
import { GET_FAKE_DATA } from "../graphql/fake/queries/fake.query";
import { Table } from "antd";
import { useState } from "react";

const columns = [
  {
    title: "Item",
    dataIndex: "item",
    key: "item",
  },
  {
    title: "Orderer",
    dataIndex: "orderer",
    key: "orderer",
  },
  {
    title: "Order Date",
    dataIndex: "orderDate",
    key: "orderDate",
  },
];

const Portal: React.FC<{}> = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: fakeData, error, loading, fetchMore } = useQuery<
    IGetFake,
    IGetFakeVariables
  >(GET_FAKE_DATA, {
    fetchPolicy: "cache-and-network",
    variables: {
      pageIndex: currentPage,
      pageSize: 10,
    },
    context: {
      clientName: "fake-backend",
    },
  });
  console.log(fakeData);

  return (
    <div style={{ margin: 40 }}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h2>PORTAL PAGE</h2>
      <h3>FAKE DATAS</h3>
      <Table
        loading={loading}
        dataSource={fakeData?.orders || []}
        rowKey={(item) => item.item}
        columns={columns}
        pagination={{
          total: 100,
          current: currentPage,
          pageSize: 10,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const localCookie =
    context.req?.headers?.cookie && cookie.parse(context.req?.headers?.cookie);
  if (localCookie?.email) {
    return {
      props: {},
    };
  } else {
    context.res.setHeader("location", "/");
    context.res.statusCode = 302;
    context.res.end();
    return {
      props: {},
    };
  }
};

export default Portal;
