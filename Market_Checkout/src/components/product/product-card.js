import { Avatar, Box, Button, Card, CardContent, Divider, Grid, TextField, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { products } from 'src/__mocks__/products';
import { useFormik } from 'formik';
import InputAdornment from '@mui/material/InputAdornment';
import * as Yup from 'yup';

export const ProductCard = ({ product, ...rest }) => {
  const formik = useFormik({
    initialValues: {
      quantitySelected: 1
    },
    validationSchema: Yup.object({
      quantitySelected: Yup
        .number()
        .min(1)
        .max(parseInt(product.quantityAvailable))
        .required('Quantity is required')
    }),
    onSubmit: (values) => {
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
      products_parsed.forEach(my_product => {
        if (my_product.title === product.title && parseInt(my_product.quantityAvailable) >= (parseInt(my_product.quantitySelected) + parseInt(values.quantitySelected))) {
          my_product.quantitySelected = parseInt(my_product.quantitySelected) + parseInt(values.quantitySelected);
          my_product.quantitySelected = my_product.quantitySelected.toString();
        }
      });
      products_string = "";
      products_parsed.forEach(product => {
        products_string += product.price + "," + product.quantityAvailable + "," + product.quantitySelected + "," + product.media + "," + product.title + ";";
      });
      sessionStorage.setItem("products", products_string);
      window.location.reload();
    }
  });

  return (
    <form
      autoComplete="off"
      onSubmit={formik.handleSubmit}
      {...rest}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pb: 3
            }}
          >
            <Avatar
              alt="Product"
              src={product.media}
              variant="square"
            />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h5"
          >
            {product.title}
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="body1"
          >
            Price: ₡ {product.price}
          </Typography>
          <Typography
            align="center"
            color="textPrimary"
            variant="body1"
          >
            Units Available: {product.quantityAvailable}
          </Typography>
        </CardContent>
        <Box sx={{ flexGrow: 1 }} />
        <Divider />
        <Box sx={{ p: 2 }}>
          <Grid
            container
            spacing={2}
            sx={{ justifyContent: 'space-around' }}
          >
            <Grid
              item
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <TextField
                id="quantitySelected"
                name="quantitySelected"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.quantitySelected}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        color="primary"
                        onClick={() => {
                          formik.setFieldValue('quantitySelected', formik.values.quantitySelected + 1);
                        }}
                        variant="contained"
                      >
                        +
                      </Button>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                disabled={product.quantityAvailable === '0' ? true : false}
                type="submit"
              >
                Add to Cart
                <AddShoppingCartIcon />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </form>
  );
}
