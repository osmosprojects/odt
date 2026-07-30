import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decrator';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  /**
   * Paginated SKU search from odt_item_master.
   * GET /api/items/search?q=<term>&stream=<stream>&page=<n>&limit=<n>
   */
  @Public()
  @Get('search')
  search(
    @Query('q') q: string,
    @Query('stream') stream: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.itemService.searchItems(
      q || '',
      stream || '',
      parseInt(page || '1'),
      parseInt(limit || '30'),
    );
  }
}
