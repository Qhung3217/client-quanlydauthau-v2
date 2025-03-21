import {
  Paper,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import type { ProductEstimateSchemaType } from './product-estimate-create-edit-form';

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#fafafa',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
// ----------------------------------
type Props = {
  productEsts: ProductEstimateSchemaType[];
  selectedIndex?: number;
  onSelected?: (productEst: ProductEstimateSchemaType, index: number) => void;
  onRemove?: (index: number) => void;
};

export default function ProductEstimatedList({
  productEsts,
  onSelected,
  selectedIndex,
  onRemove,
}: Props) {
  const isEmpty = !productEsts.length;

  const emptyPanel = () => (
    <Paper
      sx={{
        alignContent: 'center',
        textAlign: 'center',

        height: 120,
        border: (theme) => `1px dashed ${theme.palette.primary.light}`,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Bạn chưa nhập dự toán nào!
      </Typography>
      <Typography variant="body2">Hãy nhập thông tin vào form để nhập dự toán</Typography>
    </Paper>
  );
  return (
    <Paper elevation={1}>
      <Typography variant="h5" gutterBottom sx={{ px: 2, pt: 2 }}>
        Danh sách hàng hóa ({productEsts.length})
      </Typography>

      {isEmpty ? (
        emptyPanel()
      ) : (
        <TableContainer sx={{ flex: '1 1 0' }}>
          <Table sx={{ minWidth: 300, minHeight: 1 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell sx={{ width: 300 }}>Mô tả</TableCell>
                {(onSelected || onRemove) && (
                  <TableCell sx={{ width: 100 }} align="right">
                    ---
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {productEsts.map((product, index) => (
                <StyledTableRow
                  key={`${product}-${index}`}
                  sx={{
                    ...(selectedIndex === index && {
                      backgroundColor: '#f6f6f6',
                      borderColor: 'primary.main',
                    }),
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Markdown value={product.desc} />
                  </TableCell>
                  {(onSelected || onRemove) && (
                    <TableCell>
                      {onSelected && (
                        <IconButton
                          title="Sửa hàng hóa"
                          size="small"
                          onClick={() => onSelected(product, index)}
                        >
                          <Iconify icon="material-symbols:edit" />
                        </IconButton>
                      )}
                      {onRemove && (
                        <IconButton
                          title="Xóa hàng hóa"
                          size="small"
                          sx={{ ml: 1, color: 'error.main' }}
                          onClick={() => onRemove(index)}
                        >
                          <Iconify icon="lets-icons:close-ring" />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
