import type { Meta, StoryObj } from '@storybook/vue3';

import Table from '../../components/common/table/Index.vue';
import TableFoot from '../../components/common/table/Foot.vue';
import TableCell from '../../components/common/table/Cell.vue';
import TableRow from '../../components/common/table/Row.vue';
import TableHead from '../../components/common/table/Head.vue';
import TableBody from '../../components/common/table/Body.vue';
import TableHeadCell from "../../components/common/table/HeadCell.vue";
import FormCheckbox from '../../components/common/form/Checkbox.vue';

const meta = {
    title: 'Table/Table',
    render: (args) => ({
        components : { Table, TableCell, TableRow, TableHead, TableBody, TableFoot, TableHeadCell, FormCheckbox },
        template: `<Table
            :striped="args.striped"
            :sticky="args.sticky"
            :condensed="args.condensed"
            :vertical-line="args.verticalLine"
            :clickable="args.clickable"
            :border="args.border"
            :sortable="args.sortable"
            :header-variant="args.headerVariant"
        >
          <TableHead>
            <TableHeadCell v-if="args.checkable">
              <FormCheckbox />
            </TableHeadCell>
            <TableHeadCell :sortable="args.sortable">
              Table Head 1
            </TableHeadCell>
            <TableHeadCell :sortable="args.sortable">
              Table Head 2
            </TableHeadCell>
            <TableHeadCell :sortable="args.sortable">
              Table Head 3
            </TableHeadCell>
            <TableHeadCell :sortable="args.sortable">
              Table Head 4
            </TableHeadCell>
            <TableHeadCell :sortable="args.sortable">
              Table Head 5
            </TableHeadCell>
            <TableHeadCell :sortable="args.sortable">
              Table Head 6
            </TableHeadCell>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell v-if="args.checkable">
                <FormCheckbox />
              </TableCell>
              <TableCell>
                Table Cell 1
              </TableCell>
              <TableCell>
                Table Cell 2
              </TableCell>
              <TableCell>
                Table Cell 3
              </TableCell>
              <TableCell>
                Table Cell 4
              </TableCell>
              <TableCell>
                Table Cell 5
              </TableCell>
              <TableCell>
                Table Cell 6
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell v-if="args.checkable">
                <FormCheckbox />
              </TableCell>
              <TableCell>
                Table Cell 1
              </TableCell>
              <TableCell>
                Table Cell 2
              </TableCell>
              <TableCell>
                Table Cell 3
              </TableCell>
              <TableCell>
                Table Cell 4
              </TableCell>
              <TableCell>
                Table Cell 5
              </TableCell>
              <TableCell>
                Table Cell 6
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell v-if="args.checkable">
                <FormCheckbox />
              </TableCell>
              <TableCell>
                Table Cell 1
              </TableCell>
              <TableCell>
                Table Cell 2
              </TableCell>
              <TableCell>
                Table Cell 3
              </TableCell>
              <TableCell>
                Table Cell 4
              </TableCell>
              <TableCell>
                Table Cell 5
              </TableCell>
              <TableCell>
                Table Cell 6
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell v-if="args.checkable">
                <FormCheckbox />
              </TableCell>
              <TableCell>
                Table Cell 1
              </TableCell>
              <TableCell>
                Table Cell 2
              </TableCell>
              <TableCell>
                Table Cell 3
              </TableCell>
              <TableCell>
                Table Cell 4
              </TableCell>
              <TableCell>
                Table Cell 5
              </TableCell>
              <TableCell>
                Table Cell 6
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>`,
        setup() {
            return { args };
        },
    }),

    tags: ['autodocs'],
    argTypes: {
      striped: { control: 'boolean', default: false },
      sticky: { control: 'boolean', default: false },
      condensed: { control: 'boolean', default: false },
      verticalLine: { control: 'boolean', default: false },
      sortable: { control: 'boolean', default: false },
      clickable: { control: 'boolean', default: false },
      border: { control: 'boolean', default: false },
      checkable: { control: 'boolean', default: false },
      headerVariant: { control: 'select', options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'white'] },
    },
    args: {
        striped: false,
        sticky: false,
        condensed: false,
        verticalLine: false,
        sortable: false,
        clickable: false,
        border: false,
        checkable: false,
        headerVariant: 'white',
    }, // default value
} as Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableWithVerticalLine: Story = {
    name: 'With Vertical Line',
    args: {
        verticalLine: true,
    },
};

export const TableWithCondensed: Story = {
    name: 'With Condensed',
    args: {
        condensed: true,
    },
};

export const TableWithStriped: Story = {
    name: 'With Striped',
    args: {
        striped: true,
    },
};

export const TableWithSticky: Story = {
    name: 'With Sticky',
    args: {
        sticky: true,
    },
};

export const TableWithSortable: Story = {
    name: 'With Sortable',
    args: {
        sortable: true,
    },
};

export const TableWithClickable: Story = {
    name: 'With Clickable',
    args: {
        clickable: true,
    },
};

export const TableWithBorder: Story = {
    name: 'With Border',
    args: {
        border: true,
    },
};

export const TableWithCheckable: Story = {
    name: 'With Checkable',
    args: {
        checkable: true,
    },
};

export const TableWithHeaderVariant: Story = {
    name: 'With Header Background Color',
    args: {
        headerVariant: 'primary',
    },
};
