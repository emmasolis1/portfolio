import {
  Box,
  Typography
} from '@mui/material';
import { ProductCart } from './product-cart';

export const ProductListToolbar = (props) => {
  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          Products
        </Typography>
        <Box sx={{ m: 1 }}>
          <ProductCart sx={{ height: '100%' }} />
        </Box>
      </Box>
    </Box>
  );
};
