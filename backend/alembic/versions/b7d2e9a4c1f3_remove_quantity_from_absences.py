"""remove quantity from absences

Cada falta registrada passa a valer sempre 2 (uma aula por dia por disciplina),
então a coluna quantity deixa de ser necessária.

Revision ID: b7d2e9a4c1f3
Revises: 957fec8855b9
Create Date: 2026-11-22 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7d2e9a4c1f3'
down_revision: Union[str, Sequence[str], None] = '957fec8855b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column('absences', 'quantity')


def downgrade() -> None:
    """Downgrade schema."""
    op.add_column(
        'absences',
        sa.Column('quantity', sa.Integer(), nullable=False, server_default='2'),
    )
