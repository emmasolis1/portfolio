import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Avatar, Box, IconButton, Toolbar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NextLink from 'next/link';
import { getInitials } from 'src/utils/get-initials';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
  const router = useRouter();
  const { onSidebarOpen, ...other } = props;
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(sessionStorage.getItem('userFullname'));
  }, [fullName]);

  const logOut = () => {
    sessionStorage.clear();
    router.push('/');
  }

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <NextLink
            href="/account"
            passHref
          >
            <Tooltip title="Edit Profile">
              <IconButton sx={{ ml: 1 }}>
                <Avatar
                  sx={{
                    height: 40,
                    width: 40,
                    ml: 1
                  }}
                >
                  {getInitials(fullName)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </NextLink>
          <Button
            color="error"
            variant="outlined"
            onClick={logOut}
          >
            Log Out
          </Button>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
