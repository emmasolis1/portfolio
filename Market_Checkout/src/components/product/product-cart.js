import { Avatar, Box, Button, Card, CardContent, Grid, InputAdornment, Table, TableHead, TableBody, TableRow, TableCell, Typography, TableFooter, TextField } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const ProductCart = (props) => {
  const [open, setOpen] = React.useState(false);

  // Formik form to enter quantity of bills and coins to process payment
  const formik = useFormik({
    initialValues: {
      oneThousand: 0,
      fiveHundred: 0,
      oneHundred: 0,
      fifty: 0,
      twentyFive: 0
    },
    validationSchema: Yup.object({
      oneThousand: Yup.number(),
      fiveHundred: Yup.number(),
      oneHundred: Yup.number(),
      fifty: Yup.number(),
      twentyFive: Yup.number()
    }),
    onSubmit: (values) => {
      // Process payment
      let total_enterted = calculateTotalEntered(values);
      let total_purchase = getCartProductsSelected().reduce((acc, curr) => acc + parseFloat(curr.price) * curr.quantitySelected, 0).toFixed(2);
      if (total_purchase > total_enterted) {
        alert("You need to enter more money");
      } else {
        let change = calculateChangeDetails(total_enterted, total_purchase);
        checkout(change);
        setOpen(false);
      }
    }
  });

  const calculateChangeDetails = (total_entered, total_purchase) => {
    // Detail of change
    let change = total_entered - total_purchase;
    let change_detail = {
      oneThousand: 0,
      fiveHundred: 0,
      oneHundred: 0,
      fifty: 0,
      twentyFive: 0
    };
    if (change >= 500) {
      change_detail.fiveHundred = Math.floor(change / 500);
      change = change % 500;
    }
    if (change >= 100) {
      change_detail.oneHundred = Math.floor(change / 100);
      change = change % 100;
    }
    if (change >= 50) {
      change_detail.fifty = Math.floor(change / 50);
      change = change % 50;
    }
    if (change >= 25) {
      change_detail.twentyFive = Math.floor(change / 25);
      change = change % 25;
    }
    let final_change = "Your change is:\n";
    if (change_detail.fiveHundred > 0) {
      final_change += "     " + change_detail.fiveHundred + " coin(s) of ₡ 500.\n";
    }
    if (change_detail.oneHundred > 0) {
      final_change += "     " + change_detail.oneHundred + " coin(s) of ₡ 100.\n";
    }
    if (change_detail.fifty > 0) {
      final_change += "     " + change_detail.fifty + " coin(s) of ₡ 50.\n";
    }
    if (change_detail.twentyFive > 0) {
      final_change += "     " + change_detail.twentyFive + " coin(s) of ₡ 25.\n";
    }
    return final_change;
  }

  const calculateTotalEntered = (values) => {
    let total_enterted = 0;
    for (let key in values) {
      switch (key) {
        case 'oneThousand':
          total_enterted += 1000 * parseInt(values[key]);
          break;
        case 'fiveHundred':
          total_enterted += 500 * parseInt(values[key]);
          break;
        case 'oneHundred':
          total_enterted += 100 * parseInt(values[key]);
          break;
        case 'fifty':
          total_enterted += 50 * parseInt(values[key]);
          break;
        case 'twentyFive':
          total_enterted += 25 * parseInt(values[key]);
          break;
        default:
          break;
      }
    }
    return total_enterted;
  }

  // Checkout button functionality getting the products from the session storage
  const checkout = (change) => {
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
    let order = "";
    let order_total = 0;
    products_parsed.forEach(product => {
      if (product.quantitySelected > 0) {
        order += product.title + ": " + product.quantitySelected + "\n";
        order_total += parseFloat(product.price) * product.quantitySelected;
        product.quantityAvailable = parseInt(product.quantityAvailable) - parseInt(product.quantitySelected);
        product.quantitySelected = 0;
      }
    });
    products_string = "";
    products_parsed.forEach(product => {
      products_string += product.price + "," + product.quantityAvailable + "," + product.quantitySelected + "," + product.media + "," + product.title + ";";
    });

    sessionStorage.setItem("products", products_string);
    alert("Order Summary: \n" + order + "\n"+ change + "\nTotal Paid: ₡ " + order_total.toFixed(2));
    window.location.reload();
  }

  // A function to select only the items that are in the cart
  const getCartProductsSelected = () => {
    // Do this only if client side is running
    if (typeof window !== 'undefined') {
      // Do this only if session storage is not empty
      if (sessionStorage.getItem("products") !== null) {
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
          if (product_parsed.quantitySelected > 0) {
            products_parsed.push(product_parsed);
          }
        });
        return products_parsed;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return(
    <Card {...props}>
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h5"
            >
              Shopping Cart
            </Typography>
          </Grid>
          <Grid item>

            <Stack direction="row" spacing={1}>
              <IconButton aria-label="delete" color="error" onClick={() => handleClickOpen()}>
                <Button
                  color="primary"
                  variant="outlined"
                >
                  Checkout
                  <AttachMoneyIcon />
                </Button>
              </IconButton>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle
                id="alert-dialog-title"
                align="center"
                >
                  {"Process Payment of:"} ₡{getCartProductsSelected().reduce((acc, curr) => acc + parseFloat(curr.price) * curr.quantitySelected, 0).toFixed(2)}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <form
                      autoComplete='off'
                      onSubmit={formik.handleSubmit}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            id="oneThousand"
                            name="oneThousand"
                            label="1,000"
                            value={formik.values.oneThousand}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              endAdornment: <InputAdornment position="end">₡</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="fiveHundred"
                            name="fiveHundred"
                            label="500"
                            value={formik.values.fiveHundred}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              endAdornment: <InputAdornment position="end">₡</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="oneHundred"
                            name="oneHundred"
                            label="100"
                            value={formik.values.oneHundred}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              endAdornment: <InputAdornment position="end">₡</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="fifty"
                            name="fifty"
                            label="50"
                            value={formik.values.fifty}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              endAdornment: <InputAdornment position="end">₡</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="twentyFive"
                            name="twentyFive"
                            label="25"
                            value={formik.values.twentyFive}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                              endAdornment: <InputAdornment position="end">₡</InputAdornment>,
                            }}
                          />
                        </Grid >
                      </Grid >
                      <DialogActions>
                        <Button onClick={handleClose} variant="outlined" color="primary">Cancel</Button>
                        <Button variant="contained" color="secondary" type="submit">Pay</Button>
                      </DialogActions>
                    </form>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            </Stack>

          </Grid>
        </Grid>
        <Grid
          item
          lg={12}
          md={12}
          xs={12}
        >
          <Typography
            variant="subtitle1"
            align="center"
          >
            Items in Cart
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                </TableCell>
                <TableCell>
                  Product
                </TableCell>
                <TableCell>
                  Quantity
                </TableCell>
                <TableCell>
                  Price
                </TableCell>
                <TableCell>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getCartProductsSelected().map((product) => (
                <TableRow
                  hover
                  key={product.title}
                >
                  <TableCell>
                    <Avatar
                      alt={product.title}
                      src={product.media}
                      variant="square"
                    />
                  </TableCell>
                  <TableCell>
                    {product.title}
                  </TableCell>
                  <TableCell>
                    {product.quantitySelected}
                  </TableCell>
                  <TableCell>
                    ₡ {product.price}
                  </TableCell>
                  <TableCell>
                    ₡ {parseFloat(product.price) * product.quantitySelected}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>
                  Total
                </TableCell>
                <TableCell>
                  ₡ {getCartProductsSelected().reduce((acc, product) => acc + (parseFloat(product.price) * product.quantitySelected), 0).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Grid>
      </CardContent>
    </Card>
  );
};
