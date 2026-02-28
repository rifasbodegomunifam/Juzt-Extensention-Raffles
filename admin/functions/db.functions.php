<?php

class DbTransactionManager {
    
    private $wpdb;
    
    /**
     * Wrapper genérico para transacciones
     */
    private function transaction(callable $callback) {
        global $wpdb;
        
        $wpdb->query('START TRANSACTION');
        
        try {
            $result = $callback($wpdb);
            $wpdb->query('COMMIT');
            return $result;
            
        } catch (Exception $e) {
            $wpdb->query('ROLLBACK');
            error_log('Transaction failed: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Eliminar rifa con transacción
     */
    public function delete_raffle($raffle_id) {
        return $this->transaction(function($wpdb) use ($raffle_id) {
            
            // Todas las operaciones aquí
            $wpdb->delete(/* ... */);
            $wpdb->delete(/* ... */);
            wp_delete_post($raffle_id, true);
            
            return ['success' => true];
        });
    }
    
    /**
     * Actualizar orden con transacción
     */
    public function update_order($order_id, $data) {
        return $this->transaction(function($wpdb) use ($order_id, $data) {
            
            $wpdb->update(/* ... */);
            
            return ['success' => true];
        });
    }

    public function delete_masive_orders($order_ids) {
        return $this->transaction(function($wpdb) use ($order_ids) {
            
            $placeholders = implode(',', array_fill(0, count($order_ids), '%s'));
            $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->prefix}raffle_orders WHERE id IN ({$placeholders})", $order_ids));
            
            return ['success' => true];
        });
    }

    public function approve_masive_orders($order_ids) {
        return $this->transaction(function($wpdb) use ($order_ids) {
            
            $placeholders = implode(',', array_fill(0, count($order_ids), '%s'));
            $wpdb->query($wpdb->prepare("UPDATE {$wpdb->prefix}raffle_orders SET status = 'approved' WHERE id IN ({$placeholders})", $order_ids));
            
            return ['success' => true];
        });
    }

    public function reject_masive_orders($order_ids) {
        return $this->transaction(function($wpdb) use ($order_ids) {
            
            $placeholders = implode(',', array_fill(0, count($order_ids), '%s'));
            $wpdb->query($wpdb->prepare("UPDATE {$wpdb->prefix}raffle_orders SET status = 'rejected' WHERE id IN ({$placeholders})", $order_ids));
            
            return ['success' => true];
        });
    }

    public function get_order_by_email($email) {
        return $this->transaction(function($wpdb) use ($email) {
            
            $results = $wpdb->get_results($wpdb->prepare("SELECT * FROM {$wpdb->prefix}raffle_orders WHERE customer_email = %s AND status != 'completed'", $email), ARRAY_A);
            
            return ['success' => true, 'orders' => $results];
        });
    }
}