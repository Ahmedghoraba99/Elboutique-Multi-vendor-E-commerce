// use Illuminate\Database\Migrations\Migration;
// use Illuminate\Database\Schema\Blueprint;
// use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
// /**
// * Run the migrations.
// */
// public function up(): void
// {
// Schema::create('orders', function (Blueprint $table) {
// $table->id();
// $table->unsignedBigInteger('customer_id');
// // $table->unsignedBigInteger('payment_id');
// $table->enum('status', ['arrived', 'midway'])->default('midway');
// $table->timestamps();

// $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade')->onUpdate('cascade');
// // $table->foreign('payment_id')->references('id')->on('payments')->onDelete('cascade')->onUpdate('cascade');

// });
// }

// /**
// * Reverse the migrations.
// */
// public function down(): void
// {
// Schema::dropIfExists('orders');
// }
// };