import Head from 'next/head';
import { Box, Container, Grid, Pagination, Typography } from '@mui/material';
import { products } from '../__mocks__/products';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductCard } from '../components/product/product-card';
import { DashboardLayout } from '../components/dashboard-layout';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { ProductCart } from 'src/components/product/product-cart';
import { cashier } from 'src/__mocks__/cashier';

// A function to parse products array into the session storage
const parseProducts = () => {
  let products_string = "";
  products.forEach(product => {
    products_string += product.price + "," + product.quantityAvailable + "," + product.quantitySelected + "," + product.media + "," + product.title + ";";
  });
  sessionStorage.setItem("products", products_string);
}

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: products,
      page: 1,
      productsPerPage: 6
    }
  }

  componentDidMount() {
    // Check if the products are already in the session storage
    if (sessionStorage.getItem("products") === null) {
      parseProducts();
      // Create the products array from the session storage
      let products_string = sessionStorage.getItem("products");
      let products_array = products_string.split(";");
      let products_parsed = [];
      products_array.forEach(product => {
        let product_array = product.split(",");
        let product_parsed = {
          price: product_array[0],
          quantityAvailable: product_array[1],
          quantitySelected: product_array[2],
          media: product_array[3],
          title: product_array[4]
        }
        products_parsed.push(product_parsed);
      });
      products_parsed.pop();
      this.setState({
        products: products_parsed
      });
    } else {
      // Parse the products from the session storage
      let products_string = sessionStorage.getItem("products");
      let products_array = products_string.split(";");
      let products_parsed = [];
      products_array.forEach(product => {
        let product_array = product.split(",");
        let product_parsed = {
          price: product_array[0],
          quantityAvailable: product_array[1],
          quantitySelected: product_array[2],
          media: product_array[3],
          title: product_array[4]
        }
        products_parsed.push(product_parsed);
      });
      products_parsed.pop();
      this.setState({
        products: products_parsed
      });
    }

    // Check if the cashier is already in the session storage
    if (sessionStorage.getItem("cashier") === null) {
      sessionStorage.setItem("cashier", JSON.stringify(cashier));
    } else {
      // Parse the cashier from the session storage
      let cashier_string = sessionStorage.getItem("cashier");
      let cashier_parsed = JSON.parse(cashier_string);
      this.setState({
        cashier: cashier_parsed
      });
    }
  }

  render() {
    return (
      <>
        <Head>
          <title>
            Products | Material Kit
          </title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Container maxWidth="lg">
            <Typography
              sx={{ mb: 3 }}
              variant="h4"
            >
              Products
            </Typography>
            <Grid
              container
              spacing={2}
            >
              {this.state.products.map((product) => (
                <Grid
                  item
                  key={product.title}
                  xs={3}
                  sm={4}
                  md={4}
                  lg={3}
                >
                  <ProductCard product={product} />
                </Grid>
              ))}
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <ProductCart sx={{ height: '100%' }} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </>
    );
  }
}

Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Products;
