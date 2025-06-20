import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import axios from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

export function OverviewAnalyticsView() {
  const { companyId } = useParams<{ companyId: string }>();
  const [companyName, setCompanyName] = useState('Company');
  const [productCount, setProductCount] = useState<number | null>(null);
  const [superDealerCount, setSuperDealerCount] = useState<number | null>(null);
  const [requestsPending, setRequestsPending] = useState<number | null>(null);
  const [requestsApproved, setRequestsApproved] = useState<number | null>(null);

  useEffect(() => {
    if (!companyId) {
      console.warn('No companyId found in URL');
      return;
    }

    const loadData = async () => {
      try {
        const [productRes, dealerRes, requestRes, companyRes] = await Promise.all([
          axios.get(`/companies/${companyId}/products`),
          axios.get(`/companies/${companyId}/superdealers`),
          axios.get(`/orders/requests/${companyId}`),
          axios.get(`/companies/${companyId}`),
        ]);

        const products = productRes?.data?.data?.products || [];
        const dealers = dealerRes?.data?.data?.super_dealers || [];
        const requests = requestRes?.data?.data || [];
        const company = companyRes?.data?.data;

        setProductCount(products.length);
        setSuperDealerCount(dealers.length);

        setRequestsPending(requests.filter((r: any) => r.status === 'pending').length);
        setRequestsApproved(requests.filter((r: any) => r.status === 'approved').length);

        if (company?.name) {
          setCompanyName(company.name);
        }
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      }
    };

    loadData();
  }, [companyId]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
       {companyName}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
          <AnalyticsWidgetSummary
            title="Products"
            percent={0}
            total={productCount ?? 0}
            icon={<img alt="Products" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
              series: Array(7).fill((productCount ?? 0) / 7),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
          <AnalyticsWidgetSummary
            title="Super Dealers"
            percent={0}
            total={superDealerCount ?? 0}
            color="secondary"
            icon={<img alt="Super Dealers" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
              series: Array(7).fill((superDealerCount ?? 0) / 7),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
          <AnalyticsWidgetSummary
            title="Requests Pending"
            percent={0}
            total={requestsPending ?? 0}
            color="warning"
            icon={<img alt="Pending" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Pending'],
              series: [requestsPending ?? 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }} component="div">
          <AnalyticsWidgetSummary
            title="Requests Approved"
            percent={0}
            total={requestsApproved ?? 0}
            color="error"
            icon={<img alt="Approved" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Approved'],
              series: [requestsApproved ?? 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }} component="div">
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'Products', value: productCount ?? 0 },
                { label: 'Super Dealers', value: superDealerCount ?? 0 },
                { label: 'Approved', value: requestsApproved ?? 0 },
                { label: 'Pending', value: requestsPending ?? 0 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }} component="div">
          <AnalyticsWebsiteVisits
            title="Request trends"
            subheader="This month"
            chart={{
              categories: ['Pending', 'Approved'],
              series: [
                {
                  name: 'Requests',
                  data: [requestsPending ?? 0, requestsApproved ?? 0],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
